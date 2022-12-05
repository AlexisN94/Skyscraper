const config = {
   backendURL: 'http://localhost:4001/',
   workerPool: {
      size: 6,
      script: 'utils/web-worker.js',
   },
   audioSrc: {
      warning: 'assets/warning.mp3',
      success: 'assets/success.mp3',
      error: 'assets/error.mp3',
   },
   errorMessages: {
      api: {
         noConnection: 'Check your internet connection status.',
         genericError: 'An error occurred.',
      },
      searchForm: {
         emptyFields: '',
      },
   },
};

export default config;
