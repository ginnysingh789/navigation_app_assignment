//Create an object which represent how truck should move on the screen
export const Tracking_Config={ 
      animationIntervalMs: 100,//Truck should after every 1 second
      segmentDurationMs: 5000, // How much time it would take it move from one point to another
      defaultTruckSpeedKmh: 50
} as const