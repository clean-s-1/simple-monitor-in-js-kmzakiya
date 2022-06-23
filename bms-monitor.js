const { expect } = require("chai");
const Battery = require("./battery");
const { BMS_CONFIG, MESSAGES, LEVELS } = require("./bms.config");

const getLevel = (value, min, max) => {
  if (value < min) {
    return LEVELS.LOW_BREACH;
  } else if (value < max) {
    return LEVELS.NORMAL;
  }
  return LEVELS.HIGH_BREACH;
};

const isNormal = (value) => {
  return value === LEVELS.NORMAL;
};

const getTolerance = (limit, tolerance) => {
  return (limit * tolerance) / 100;
};

const checkWarningLevel = (value, minTolerance, maxTolerance) => {
  if (value <= minTolerance) {
    return LEVELS.LOW_WARNING;
  } else if (value >= maxTolerance) {
    return LEVELS.HIGH_WARNING;
  }
  return LEVELS.NORMAL;
};

const print = (messagekey, language) => {
  console.log(MESSAGES[language][messagekey]);
};

const getPropertyStatus = (value, config) => {
  const tolerance = getTolerance(config.max, config.tolerance);
  let level = getLevel(value, config.min, config.max);
  const isInRange = isNormal(level);
  if (isInRange) {
    level = checkWarningLevel(
      value,
      config.min + tolerance,
      config.max - tolerance
    );
  }
  return { isInRange, level };
};

const printStatusMessage = (level, config, language) => {
  if (!isNormal(level)) {
    const messagekey = config[level];
    print(messagekey, language);
  }
};

const batteryIsOk = ({ stateOfCharge, chargeRate, temperature }, config, language = "en") => {
  const socStatus = getPropertyStatus(stateOfCharge, config.stateOfCharge);
  const crStatus = getPropertyStatus(chargeRate, config.chargeRate);
  const tempStatus = getPropertyStatus(temperature, config.temperature);

  printStatusMessage(socStatus.level, config.stateOfCharge, language);
  printStatusMessage(crStatus.level, config.chargeRate, language);
  printStatusMessage(tempStatus.level, config.temperature, language);

  return socStatus.isInRange && crStatus.isInRange && tempStatus.isInRange;
};


expect(getPropertyStatus(30, BMS_CONFIG.stateOfCharge)).to.include({
  level: LEVELS.NORMAL,
  isInRange: true,
});
expect(getPropertyStatus(22, BMS_CONFIG.stateOfCharge)).to.include({
  level: LEVELS.LOW_WARNING,
  isInRange: true,
});
expect(getPropertyStatus(50, BMS_CONFIG.temperature)).to.include({
  level: LEVELS.HIGH_BREACH,
  isInRange: false,
});

expect(getPropertyStatus(0.7, BMS_CONFIG.chargeRate)).to.include({
  level: LEVELS.NORMAL,
  isInRange: true,
});
expect(getPropertyStatus(0.9, BMS_CONFIG.chargeRate)).to.include({
  level: LEVELS.HIGH_BREACH,
  isInRange: false,
});

expect(getPropertyStatus(10, BMS_CONFIG.stateOfCharge)).to.include({
  level: LEVELS.LOW_BREACH,
  isInRange: false,
});

expect(batteryIsOk(new Battery(40, 30, 0.7), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(1, 30, 0.7), BMS_CONFIG)).to.be.true;
expect(batteryIsOk(new Battery(55, 22, 0.7), BMS_CONFIG)).to.be.false;
expect(batteryIsOk(new Battery(40, 100, 0.7), BMS_CONFIG)).to.be.false;
expect(batteryIsOk(new Battery(40, 10, 0.9), BMS_CONFIG)).to.be.false;
