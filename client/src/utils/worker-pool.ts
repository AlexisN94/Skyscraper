export type Job<T> = {
   args: any[];
   onmessage: (data: T, releaseWorker: () => void) => void;
   onerror: (error: ErrorEvent) => void;
};

export type PoolWorker = Worker & {
   available: boolean;
   id: number;
};

export class WorkerPool<T> {
   private jobQueue: Job<T>[];
   private workers: PoolWorker[];
   private interval: NodeJS.Timer;
   private stopRequested: boolean;
   private poolSize: number;
   private scriptURL: string;
   onCompleted: (...args: any) => void;

   constructor(poolSize: number, workerScript: () => void) {
      const code = workerScript.toString();
      const blob = new Blob([`(${code})()`]);
      this.scriptURL = URL.createObjectURL(blob);
      this.jobQueue = [];
      this.poolSize = poolSize;
      this.initWorkers();
   }

   start() {
      this.stopRequested = false;
      this.interval = setInterval(() => {
         const worker = this.getAvailableWorker();
         if (worker && this.jobQueue.length > 0 && !this.stopRequested) {
            this.employWorker(worker, this.jobQueue.shift());
            console.log(`Worker employed (ID: ${worker.id})`);
         }
      }, 500);
   }

   enqueue(job: Job<T>) {
      this.jobQueue.push(job);
   }

   pause() {
      clearInterval(this.interval);
   }

   continue() {
      this.start();
   }

   immediatelyStopAndReset() {
      clearInterval(this.interval);
      this.workers.map((it) => it.terminate());
      this.jobQueue = [];
      this.initWorkers();
   }

   requestStop() {
      this.stopRequested = true;
   }

   private getAvailableWorker = () => this.workers.filter((it) => it.available)[0];

   private allWorkersStopped = () =>
      this.workers.filter((it) => it.available).length === this.workers.length;

   private releaseWorker = (worker: PoolWorker) => {
      worker.available = true;
      if (
         this.onCompleted &&
         this.allWorkersStopped() &&
         (this.jobQueue.length === 0 || this.stopRequested)
      ) {
         this.onCompleted();
      }
   };

   private employWorker = (worker: PoolWorker, job: Job<T>) => {
      worker.available = false;

      worker.onmessage = (event: MessageEvent<T>) => {
         job.onmessage(event.data as T, () => this.releaseWorker(worker));
      };
      worker.onerror = (error: ErrorEvent) => {
         this.releaseWorker(worker);
         job.onerror(error);
      };
      worker.postMessage([...job.args]);
   };

   private initWorkers() {
      this.workers = Array(this.poolSize)
         .fill(null)
         .map((_, index) => {
            const poolWorker = new Worker(this.scriptURL) as PoolWorker;
            poolWorker.available = true;
            poolWorker.id = index + 1;
            return poolWorker;
         });
   }
}
