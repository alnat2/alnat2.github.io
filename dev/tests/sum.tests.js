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