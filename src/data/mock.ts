import type { Route, Truck } from "../types/tracking";

export const truck: Truck = {
  id: "TRUCK-001",
  name: "FreightFox Truck 01",
  speedKmh: 50,
};

export const route: Route = {
  id: "ROUTE-001",
  name: "Chandigarh Delivery Route",
  stops: [
    {
      id: "origin",
      name: "Origin",
      corrdinates: {
        lat: 30.7333,
        lng: 76.7794,
      },
    },
    {
      id: "d1",
      name: "D1",
      corrdinates: {
        lat: 30.7196,
        lng: 76.8107,
      },
    },
    {
      id: "d2",
      name: "D2",
      corrdinates: {
        lat: 30.7046,
        lng: 76.8017,
      },
    },
    {
      id: "d3",
      name: "D3",
      corrdinates: {
        lat: 30.6904,
        lng: 76.8277,
      },
    },
  ],
};