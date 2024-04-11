var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function validatetrips(shipment, trips) {
    var alllocations = __spreadArray(__spreadArray([], shipment.pickups, true), shipment.dropoffs, true);
    var visitedlocations = trips.flatMap(function (trip) { return __spreadArray(__spreadArray([], trip.pickups, true), trip.dropoffs, true); });
    var alllocationsvisited = alllocations.every(function (location) {
        return visitedlocations.some(function (visitedlocation) { return visitedlocation.name === location.name; });
    });
    if (!alllocationsvisited) {
        return false;
    }
    var pickupCounts = visitedlocations.filter(function (location) { return shipment.pickups.some(function (pickup) { return pickup.name === location.name; }); })
        .reduce(function (acc, location) {
        acc[location.name] = (acc[location.name] || 0) + 1;
        return acc;
    }, {});
    var check_duplicate = Object.values(pickupCounts).some(function (count) { return count > 1; });
    if (check_duplicate) {
        return false;
    }
    var visits = trips.filter(function (trip) { return trip.warehouse !== undefined; }).length;
    return visits <= 1;
}
//test data
var shipment = {
    pickups: [{ name: "A" }, { name: "B" }],
    dropoffs: [{ name: "C" }, { name: "D" }],
};
var validtrips = [
    { pickups: [{ name: "A" }], warehouse: { name: "W" } },
    { pickups: [{ name: "B" }], warehouse: { name: "W" } },
    { pickups: [], dropoffs: [{ name: "C" }], warehouse: { name: "W" } },
    { pickups: [], dropoffs: [{ name: "D" }], warehouse: { name: "W" } },
];
var invalidtrips = [
    { pickups: [{ name: "A" }], warehouse: { name: "W1" } },
    { pickups: [{ name: "B" }], warehouse: { name: "W2" } },
    { pickups: [], dropoffs: [{ name: "C" }], warehouse: { name: "W3" } },
    { pickups: [], dropoffs: [{ name: "D" }], warehouse: { name: "W4" } },
];
console.log(validatetrips(shipment, validtrips));
console.log(validatetrips(shipment, invalidtrips));
