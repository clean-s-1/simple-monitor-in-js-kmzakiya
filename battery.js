class Battery {
  temperature;
  stateOfCharge;
  chargeRate;
  constructor(temperature, 
    stateOfCharge, 
    chargeRate) {
    this.temperature = temperature;
    this.stateOfCharge = stateOfCharge;
    this.chargeRate = chargeRate;
  }
  toString(){
      return `Temperature:${this.temperature}, State of Charge:${this.stateOfCharge}, Charge Rate:${this.chargeRate}`;
  }
}
module.exports = Battery;
