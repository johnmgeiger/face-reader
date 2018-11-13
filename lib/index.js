"use strict";

var classifier;
var featureExtractor;
var video;
var loss;
var happyButton;
var sadButton;
var trainButton;
var buttonMargins = 10;
var label = 'Initiating Facial Recognition';

function modelReady() {
  label = 'Model is ready';
}

function videoReady() {
  label = 'Model is loading.';
}

function getResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }

  label = result;
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(getResults);
}

function initButtons() {
  happyButton = createButton('Happy');
  happyButton.position(buttonMargins, height + 30);
  happyButton.mousePressed(function () {
    classifier.addImage('happy');
    label = 'Happy added';
  });
  sadButton = createButton('Sad');
  sadButton.position(buttonMargins * 2 + happyButton.width, height + 30);
  sadButton.mousePressed(function () {
    classifier.addImage('sad');
    label = 'Sad added';
  });
  trainButton = createButton('Train');
  trainButton.position(buttonMargins * 4 + happyButton.width + sadButton.width, height + 30);
  trainButton.mousePressed(function () {
    label = 'Training. ';
    classifier.train(function (lossValue) {
      if (!lossValue) {
        console.log('Finished training');
        classifyVideo();
        return;
      }

      loss = lossValue;
      label = "Training. Loss value: ".concat(lossValue);
    });
  });
}

function setup() {
  createCanvas(640, 420);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  console.log('Model loading...');
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  classifier = featureExtractor.classification(video, videoReady);
  initButtons();
}

function draw() {
  image(video, 0, 0);
  fill(0);
  rect(0, height - 67, width, 67);
  fill(255);
  textSize(50);
  text(label, 10, height - 15);
}