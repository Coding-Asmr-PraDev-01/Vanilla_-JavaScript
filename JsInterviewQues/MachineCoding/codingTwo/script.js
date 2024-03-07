// Coding Que Link : https://workat.tech/machine-coding/practice/design-parking-lot-qm6hwq4wkhp8

const parkingLots = [];

class ParkingSystem {
     constructor(lotId, noOfFloors, noOfSlotsPerFloor){
          this._lotId = lotId;
          this._noOfFloors = noOfFloors;
          this._noOfSlotsPerFloor = noOfSlotsPerFloor;
     }

     createParkingLot(){
          const parkingLot = {
               lotId: this._lotId,
               floors: []
          }
          for(let i = 0; i < this._noOfFloors; i++){
               const floor = {
                    slotsPerFloor: [
                         {vehicleType: 'Truck', slotCount: 1},
                         {vehicleType: 'Bike', slotCount: 2},
                         {vehicleType: 'Car', slotCount: this._noOfSlotsPerFloor - 3}
                    ]
               }
               parkingLot.floors.push(floor);
          }
          parkingLots.push(parkingLot);
     }

     parkVehicle(type, regNo, color){
          for(const parkingLot of parkingLots){
               for(const floor of parkingLot.floors){
                    if(floor.slotsPerFloor[(type === "Bike") ? 1 : (type === "Truck") ? 0 : 2].slotCount > 0){
                         const slotIndex = floor.slotsPerFloor.reduce((acc, currSlot, ind) => {
                              if(currSlot.vehicleType === type && currSlot.slotCount > 0
                                   && (acc == -1 || currSlot.slotCount  < floor.slotsPerFloor[acc].slotCount)){
                                        return ind;
                                   }
                                   return acc;
                         }, -1);

                         // Create the ticket if we found the index of floor with minimum slot count
                         if(slotIndex !== -1){
                              floor.slotsPerFloor[slotIndex].slotCount--;
                              const ticketId = `${parkingLot.lotId}_${parkingLot.floors.indexOf(floor) + 1}_${slotIndex + 1}`;
                              return ticketId;
                         }
                    }
               }
          }
          console.log(`No available slot for ${type}`);
          return null;
     }

     unparkVehicle(ticketId){
          for(const parkingLot of parkingLots){
               for(const floor of parkingLot.floors){
                    const [lotId, floorNumber, slotNumber] = ticketId.split("_");
                    let floorInd = parseInt(floorNumber) - 1;
                    let slotInd = parseInt(slotNumber) - 1;
                    console.log(floorInd, slotInd)
                    if(
                         parkingLot.lotId === lotId
                         && floorInd >= 0 && floorInd < parkingLot.floors.length
                         && slotInd >= 0 && slotInd < floor.slotsPerFloor.length
                    ){
                         parkingLot.floors[floorInd].slotsPerFloor[slotInd].slotCount++;
                         console.log(`Vehicle Successfully Unparked : ${ticketId}`);
                         return;
                    }
               }
          }
          console.log(`Ticket Id is invalid.`);
     }

     displayFreeSlotsPerFloor(vehicleType){
          for(const parkingLot of parkingLots){
               for(const floor of parkingLot.floors){
                    const freeSlots = floor.slotsPerFloor
                    .filter((slot, ind) => {
                         return slot.vehicleType === vehicleType
                    }).map((slot, ind) => `${slot.vehicleType} : ${slot.slotCount} slots`);

                    console.log(`Floor ${parkingLot.floors.indexOf(floor) + 1}: ${freeSlots.join(', ')}`);
               }
          }
     }

     displayAllFreeSlots(){
          for(const parkingLot of parkingLots){
               for(const floor of parkingLot.floors){
                    const freeSlots = floor.slotsPerFloor.map((slot, ind) => `${slot.vehicleType} : ${slot.slotCount} slots`);
                    console.log(`Floor ${parkingLot.floors.indexOf(floor) + 1}: ${freeSlots.join(', ')}`);
               }
          }
     }

     displayOccupiedSlotsPerFloor(vehicleType){
          for(const parkingLot of parkingLots){
               for(const floor of parkingLot.floors){
                    const occupiedSlots = floor.slotsPerFloor
                    .filter((slot, ind) => slot.vehicleType === vehicleType && slot.slotCount > 0)
                    .map((slot, ind) => {
                         return `${slot.vehicleType} occupied : ${
                              (slot.vehicleType === 'Bike') ? 2 - slot.slotCount
                              : (slot.vehicleType === 'Truck')
                              ? 1 - slot.slotCount : this._noOfSlotsPerFloor - 3 - slot.slotCount}`
                    });
                    console.log(`Floor ${parkingLot.floors.indexOf(floor) + 1} : ${occupiedSlots.join(', ')}`);
                    // console.log("Occupied Slots : " ,occupiedSlots);
               }
          }
     }
}



const houseParking = new ParkingSystem(111, 3, 10);
houseParking.createParkingLot();
houseParking.parkVehicle('Bike', 'Pra101', 'BluePurple');
const id = houseParking.parkVehicle('Bike', 'Pra102', 'orangeRed');
console.log(id)
houseParking.unparkVehicle(id)
// houseParking.displayOccupiedSlotsPerFloor('Bike');
console.log(parkingLots)
