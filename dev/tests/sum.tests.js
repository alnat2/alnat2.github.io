import * as cd from '../js/cdtLib.js';

describe('inputValidate function testing', function () {
    it('should return input string', function () {
      const mins = cd.inputValidate('1+2*4', '[^\\d\+\\*\\.]+');
      chai.expect(mins.data).to.equal('1+2*4');
    });
    it('should return unacceptable chars', function () {
      const mins = cd.inputValidate('1-2,', '[^\\d\+\\*\\.]+');
      chai.expect(mins.unaccept).to.equal('- ,');
    });
  });
describe('secondsToTimeLeftString function testing', function () {
    it('should return 00:35 string', function () {
      const time = cd.secondsToTimeLeftString(35);
      chai.expect(time).to.equal('0:35');
    });
    it('should return 02:35 string', function () {
      const time = cd.secondsToTimeLeftString(150);
      chai.expect(time).to.equal('2:30');
    });
    it('should return 0:05 string', function () {
      const time = cd.secondsToTimeLeftString('5');
      chai.expect(time).to.equal('0:05');
    });
    it('should return 0:00 string', function () {
      const time = cd.secondsToTimeLeftString(0);
      chai.expect(time).to.equal('0:00');
    });
    it('should return 61:01 string', function () {
      const time = cd.secondsToTimeLeftString(3661);
      chai.expect(time).to.equal('61:01');
    });
  });
describe('valuesToArray function testing', function () {
    it('should return reversed array - plus limiters', function () {
      const arr = cd.valuesToArray('1+2+3');
      chai.expect(arr).to.have.ordered.members(['3','2','1']);
    });
    it('should return reversed array - plus & mul limiters', function () {
      const arr = cd.valuesToArray('2+1*3');
      chai.expect(arr).to.have.ordered.members(['1','1','1','2']);
    });
    it('should return reversed array - space limiters', function () {
      const arr = cd.valuesToArray('1 2 3', ' ');
      chai.expect(arr).to.have.ordered.members(['3','2','1']);
    });
    it('should return reversed array - space & ex limiters', function () {
      const arr = cd.valuesToArray('2 1x4', ' ', 'x');
      chai.expect(arr).to.have.ordered.members(['1','1','1','1','2']);
    });
    it('should return reversed array - extra limiter', function () {
      const arr = cd.valuesToArray('1+2+3+');
      chai.expect(arr).to.have.ordered.members(['3','2','1']);
    });
    it('should return nan string', function () {
      const arr = cd.valuesToArray('zz');
      chai.expect(arr).to.eql(['nan']);
    });
  });