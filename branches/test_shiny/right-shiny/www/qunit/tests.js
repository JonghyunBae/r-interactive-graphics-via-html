test("prettydate.format", function() {
    function unitTest1(fileName, expectedDataArr, expectedLabelArr) {
    	equal(getData(fileName).dataArr[0], expectedDataArr);
    	equal(getData(fileName).labelArr[0], expectedLabelArr);
    }
    function unitTest2(fileName, expectedDataArr, expectedLabelArr) {
    	equal(getData(fileName).dataArr[1], expectedDataArr);
    	equal(getData(fileName).labelArr[1], expectedLabelArr);
    }
    function unitTest3(fileName, expectedDataArr, expectedLabelArr) {
    	equal(getData(fileName).dataArr[2], expectedDataArr);
    	equal(getData(fileName).labelArr[2], expectedLabelArr);
    }
    function unitTest4(fileName, expectedDataArr, expectedLabelArr) {
    	equal(getData(fileName).dataArr[3], expectedDataArr);
    	equal(getData(fileName).labelArr[3], expectedLabelArr);
    }
    
    unitTest1("diamonds-from-R_1K.csv", "0.3,Ideal,E,VS1,60.7,57,911,4.36,4.31,2.63", "carat");
    unitTest2("diamonds-from-R_1K.csv", "0.72,Premium,G,VS2,62.9,57,2795,5.73,5.65,3.58", "cut");
    unitTest3("diamonds-from-R_1K.csv", "0.52,Premium,H,VVS2,61.1,59,2246,5.21,5.17,3.17", "color");
    unitTest4("diamonds-from-R_1K.csv", "1,Good,D,SI1,64.3,62,4312,6.18,6.13,3.96", "clarity");
    
    unitTest1("_sub.diamonds.csv", "0.31,Good,G,VVS2,63.3,57,707,4.28,4.31,2.72", "carat");
    unitTest2("_sub.diamonds.csv", "0.3,Ideal,E,SI1,62.3,57,499,4.29,4.31,2.68", "cut");
    unitTest3("_sub.diamonds.csv", "1.08,Ideal,H,SI1,60,58,5867,6.69,6.66,4.01", "color");
    unitTest4("_sub.diamonds.csv", "2.18,Premium,G,SI2,61.9,60,17841,8.24,8.29,5.12", "clarity");
});