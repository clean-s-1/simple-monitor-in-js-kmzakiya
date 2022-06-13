const {expect} = require('chai');

function batteryIsOk(temperature, soc, charge_rate) {
    if (temperature < 0 || temperature > 45) {
        console.log('Temperature is out of range!');
        return false;
    } else if (soc < 20 || soc > 80) {
        console.log('State of Charge is out of range!')
        return false;
    } else if (charge_rate > 0.8) {
        console.log('Charge rate is out of range!');
        return false;
    }
    return true;
}

expect(batteryIsOk(25, 70, 0.7)).to.be.true;
expect(batteryIsOk(50, 85, 0)).to.be.false;
