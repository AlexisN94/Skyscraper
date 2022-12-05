export type Job<T> = {
   args: any[];
   onmessage: (data: T, releaseWorker: () => void) => void;
   onerror: (error: ErrorEvent) => void;
};

export type PoolWorker = Worker & {
   available: boolean;
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
         }
      }, 500);
   }

   enqueue(job: Job<T>) {
      this.jobQueue.push(job);
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
         worker.available = true;
         job.onerror(error);
      };
      worker.postMessage([...job.args]);
   };

   private initWorkers() {
      this.workers = Array(this.poolSize)
         .fill(null)
         .map((_) => {
            const workee = new Worker(this.scriptURL);
            workee['available'] = true;
            return workee as PoolWorker;
         });
   }
}
