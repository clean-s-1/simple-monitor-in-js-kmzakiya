const { expect } = require("chai");
const Battery = require("./battery");
const BMS_CONFIG = require("./bms.config");

function getDeviationFromMin(min, value) {
  return value < min ? min - value : 0;
}

function getDeviationFromMax(max, value) {
  return value > max ? value - max : 0;
}

function printBreach(breach, state, property, battery) {
  console.log(
    `${property} is ${state} by ${breach} - ${battery.toString()}`
  );
}

function checkIfPropertyInRange(key, battery, config, printFunction) {
  const deviationFromMin = getDeviationFromMin(config.min, battery[key]);
  const deviationFromMax = getDeviationFromMax(config.max, battery[key]);
  const breach = deviationFromMin || deviationFromMax;
  if (breach) {
    printFunction(breach, deviationFromMin ? 'LOW' : 'HIGH', config.name, battery);
    return false;
  }
  return true;
}

function batteryIsOk(battery, bmsConfig) {
  return (
    checkIfPropertyInRange("temperature", battery, bmsConfig.temperature, printBreach) &&
    checkIfPropertyInRange("stateOfCharge", battery, bmsConfig.stateOfCharge, printBreach) &&
    checkIfPropertyInRange("chargeRate", battery, bmsConfig.chargeRate, printBreach)
  );
}

expect(batteryIsOk(new Battery(0, 70, 0.7), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(25, 70, 0.7), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(45, 70, 0.7), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(50, 70, 0.7), BMS_CONFIG)).to.be.false;

expect(batteryIsOk(new Battery(40, 10, 0), BMS_CONFIG)).to.be.false;
expect(batteryIsOk(new Battery(40, 20, 0), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(40, 50, 0), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(40, 80, 0), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(50, 99, 0), BMS_CONFIG)).to.be.false;

expect(batteryIsOk(new Battery(25, 50, 0.8), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(40, 80, 0.9), BMS_CONFIG)).to.be.false;
