interface location {
  name: string;
}
interface trip {
  pickups: location[];
  dropoffs: location[];
  warehouse?: location;
}
interface Shipment {
  pickups: location[];
  dropoffs: location[];
}
function validatetrips(shipment: Shipment, trips: trip[]): boolean {

  const alllocations = [...shipment.pickups, ...shipment.dropoffs];
  const visitedlocations = trips.flatMap((trip) => [...trip.pickups, ...trip.dropoffs]);
  const alllocationsvisited = alllocations.every((location) =>
        visitedlocations.some((visitedlocation) => visitedlocation.name === location.name)
  );
  if (!alllocationsvisited) {
    return false;
  }
  const pickupCounts = visitedlocations.filter((location) => shipment.pickups.some((pickup) => pickup.name === location.name))
    .reduce((acc, location) => { acc[location.name] = (acc[location.name] || 0) + 1;
      return acc;
    },{} as Record<string, number>);

  const check_duplicate = Object.values(pickupCounts).some((count) => count > 1);
  if (check_duplicate) {
    return false;
  }
  const visits = trips.filter((trip) => trip.warehouse !== undefined).length;
  return visits<= 1;
}

//test data
const shipment: Shipment = {
  pickups: [{ name: "A" }, { name: "B" }],
  dropoffs: [{ name: "C" }, { name: "D" }],
};

const validtrips: trip[] = [
  { pickups: [{ name: "A" }], warehouse: { name: "W" } },
  { pickups: [{ name: "B" }], warehouse: { name: "W" } },
  { pickups: [], dropoffs: [{ name: "C" }], warehouse: { name: "W" } },
  { pickups: [], dropoffs: [{ name: "D" }], warehouse: { name: "W" } },
];

const invalidtrips: trip[] = [
  { pickups: [{ name: "A" }], warehouse: { name: "W1" } },
  { pickups: [{ name: "B" }], warehouse: { name: "W2" } },
  { pickups: [], dropoffs: [{ name: "C" }], warehouse: { name: "W3" } },
  { pickups: [], dropoffs: [{ name: "D" }], warehouse: { name: "W4" } },
];

console.log(validatetrips(shipment, validtrips)); 
console.log(validatetrips(shipment, invalidtrips)); 
