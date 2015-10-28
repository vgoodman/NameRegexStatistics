describe('Helper Functions', function() {
  describe('HelperFunctions.sumArray', function () {
    it('should sum the array', function () {
      chai.expect(NR.HelperFunctions.sumArray([3,1,4])).to.equal(8);
    });
  });

  describe('HelperFunctions.capitalizeFirstLetter', function () {
    it('should capitalize the first letter of a string', function () {
      chai.expect(NR.HelperFunctions.capitalizeFirstLetter("a1bc3dE")).to.equal("A1bc3de");
    });
  });

  describe('HelperFunctions.replaceAllStrings', function () {
    it('should replace strings', function () {
      chai.expect(NR.HelperFunctions.replaceAllStrings("Remove these words", {"Remove ":"Add ", " words": " characters"})).to.equal("Add these characters");
    });
  });

  describe('HelperFunctions.generateColors', function () {
    it('generate a certain amount of colors', function () {
      chai.expect(NR.HelperFunctions.generateColors(5)).to.be.an("array");
      chai.expect(NR.HelperFunctions.generateColors(5)).to.have.length(5);
    });
  });
});
