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
    it('should return reversed array - zeros inside', function () {
      const arr = cd.valuesToArray('1+2+0+3+0');
      chai.expect(arr).to.have.ordered.members(['3','2','1']);
    });
    it('should return nan string', function () {
      const arr = cd.valuesToArray('zz');
      chai.expect(arr).to.eql(['nan']);
    });
    it('should return undefined int', function () {
      const arr = cd.valuesToArray(0);
      chai.expect(arr).to.have.equal(undefined);
    });
    it('should return empty array', function () {
      const arr = cd.valuesToArray('0');
      chai.expect(arr).to.have.eql([]);
    });
    it('should return empty array', function () {
      const arr = cd.valuesToArray('0*3');
      chai.expect(arr).to.eq;([]);
    });
    it('should return empty array', function () {
      const arr = cd.valuesToArray('3*0');
      chai.expect(arr).to.eq;([]);
    });
    it('should return reversed array without zero', function () {
      const arr = cd.valuesToArray('0+2+3');
      chai.expect(arr).to.have.ordered.members(['3','2']);
    });
    it('should return reversed array without zeros', function () {
      const arr = cd.valuesToArray('0+1+0+3');
      chai.expect(arr).to.have.ordered.members(['3','1']);
    });
  });
describe('displayTimeLeft function testing', function () {
  it('should display time string', function () {
    const displayEl = document.getElementById('da');
    cd.displayTimeLeft('65', displayEl);
    document.title = 'Tests again';
    chai.expect(displayEl.textContent).to.equal('1:05');
  });
});
describe('displayTotalTime function testing', function () {
  it('should display total time with -s endings string', function () {
    const displayEl = document.getElementById('da');
    cd.displayTotalTime(['5', '3'], displayEl);
    chai.expect(displayEl.textContent).to.equal('total timers time is: 8 minutes');
  });
  it('should display total time without -s endings string', function () {
    const displayEl = document.getElementById('da');
    cd.displayTotalTime(['1', '0'], displayEl);
    chai.expect(displayEl.textContent).to.equal('total timers time is: 1 minute');
  });
  it('should not display total time string', function () {
    const displayEl = document.getElementById('da');
    cd.displayTotalTime(['1'], displayEl);
    chai.expect(displayEl.textContent).to.equal('');
  });
});
describe('displayPredefinedTimers function testing', function () {
  it('should return 4 children for select element', function () {
    const displayEl = document.getElementById('da');
    const arr = 
      ['15+5+15+9+15',
      '15*3',
      '15+10+15',
      '15+11+15+10+15+8+15'];
    cd.displayPredefinedTimers({
      arr: arr,
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children.length).to.equal(4);
    displayEl.removeChild(displayEl.children[0]);
  });
  it('should return 15*3 string', function () {
    const displayEl = document.getElementById('da');
    const arr = 
      ['15+5+15+9+15',
      '15*3',
      '15+10+15',
      '15+11+15+10+15+8+15'];
    cd.displayPredefinedTimers({
      arr: arr,
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children[1].value).to.equal('15*3');
    displayEl.removeChild(displayEl.children[0]);
  });
  it('should return element name "OPTION"', function () {
    const displayEl = document.getElementById('da');
    const arr = 
      ['15+5+15+9+15',
      '15*3',
      '15+10+15',
      '15+11+15+10+15+8+15'];
    cd.displayPredefinedTimers({
      arr: arr,
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children[1].nodeName).to.equal('OPTION');
    displayEl.removeChild(displayEl.children[0]);
  });
  it('should return element name "BUTTON"', function () {
    const displayEl = document.getElementById('da');
    const arr = 
      ['15+5+15+9+15',
      '15*3',
      '15+11+15+10+15+8+15'];
    cd.displayPredefinedTimers({
      arr: arr,
      container: 'div',
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children[1].nodeName).to.equal('BUTTON');
    displayEl.removeChild(displayEl.children[0]);
  });
  it('should return 2 children for div element', function () {
    const displayEl = document.getElementById('da');
    const arr = 
      ['15+10+15',
      '15+11+15+8+15'];
    cd.displayPredefinedTimers({
      arr: arr,
      container: 'div',
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children.length).to.equal(2);
    displayEl.removeChild(displayEl.children[0]);
  });
});
describe('displayNextTimers function testing', function () {
  it('should return 3 children(without first) for ul element', function () {
    const displayEl = document.getElementById('da');
    const arr = ['15','13','1','8'];
    cd.displayNextTimers({
      arr: arr,
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children.length).to.equal(3);
    displayEl.removeChild(displayEl.children[0]);
  });
  it('should return "No more timers" for 1 element', function () {
    const displayEl = document.getElementById('da');
    const arr = ['15'];
    cd.displayNextTimers({
      arr: arr,
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children[0].innerHTML).to.equal('No more timers');
    displayEl.removeChild(displayEl.children[0]);
  });
  it('should return 6 for element value', function () {
    const displayEl = document.getElementById('da');
    const arr = ['15', '6', '4'];
    cd.displayNextTimers({
      arr: arr,
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children[0].children[0].innerHTML).to.equal('6');
    displayEl.removeChild(displayEl.children[0]);
  });
  it('should return "delete" for element value', function () {
    const displayEl = document.getElementById('da');
    const arr = ['15', '6', '4'];
    cd.displayNextTimers({
      arr: arr,
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children[0].children[1].innerHTML).to.equal('delete');
    displayEl.removeChild(displayEl.children[0]);
  });
  it('should return -1 for argument value', function () {
    const displayEl = document.getElementById('da');
    const arr = ['15', '6', '4'];
    cd.displayNextTimers({
      arr: arr,
      displayElement: displayEl});
    chai.expect(displayEl.children[0].children[0].children[0].dataset.arrpos).to.equal('-1');
    displayEl.removeChild(displayEl.children[0]);
  });
});