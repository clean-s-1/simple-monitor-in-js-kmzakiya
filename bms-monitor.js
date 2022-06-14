const { expect } = require("chai");
const Battery = require("./battery");
const BMS_CONFIG = require("./bms.config");

function getDeviationFromMin(min, value) {
  return value < min ? min - value : 0;
}

function getDeviationFromMax(max, value) {
  return value > max ? value - max : 0;
}

function printBreach(deviationFromMin, deviationFromMax, name, battery) {
  const breach = deviationFromMin || deviationFromMax;
  console.log(
    `${name} is ${
      deviationFromMin ? "LOW" : "HIGH"
    } by ${breach} - ${battery.toString()}`
  );
}

function checkIfPropertyInRange(key, battery, bmsConfig) {
  let isInRange = true;
  const config = bmsConfig[key];
  const deviationFromMin = getDeviationFromMin(config.min, battery[key]);
  const deviationFromMax = getDeviationFromMax(config.max, battery[key]);
  if (deviationFromMin || deviationFromMax) {
    isInRange = false;
    printBreach(deviationFromMin, deviationFromMax, config.name, battery);
  }
  return isInRange;
}

function batteryIsOk(battery, bmsConfig) {
  return (
    checkIfPropertyInRange("temperature", battery, bmsConfig) &&
    checkIfPropertyInRange("stateOfCharge", battery, bmsConfig) &&
    checkIfPropertyInRange("chargeRate", battery, bmsConfig)
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
