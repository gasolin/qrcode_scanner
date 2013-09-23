var QRCodeScanner = {
  canvas: document.getElementById("qr-canvas"),
  video: document.getElementById('v'),
  // photo: document.getElementById('p'),
  width: 320,
  height: 240,
  streaming: false,

  read: function scanner_read(a) {
	alert(a);
	var msg = document.getElementById('message');
	msg.innerText = a;
  },

  // imageData: null,
  context: null,
  init: function scanner_init() {
  	navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);
  	var self = this;
  	navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        // if (navigator.mozGetUserMedia) {
        //   self.video.mozSrcObject = stream;
        // } else {
        var vendorURL = window.URL || window.webkitURL;
        self.video.src = vendorURL.createObjectURL(stream);
        // }
        self.video.play();
      },
        function(err) {
        console.log("An error occured! " + err);
      }
    );

    this.canvas.addEventListener("dragenter", this.dragenter, false);
    this.canvas.addEventListener("dragover", this.dragover, false);
    this.canvas.addEventListener("drop", this.drop.bind(this), false);

    qrcode.callback = this.read;

    this.video.addEventListener('canplay', function(ev){
      if (!self.streaming) {
        // self.height = self.video.videoHeight / (self.video.videoWidth/self.width);
        self.video.setAttribute('width', self.width);
        self.video.setAttribute('height', self.height);
        self.canvas.setAttribute('width', self.width);
        self.canvas.setAttribute('height', self.height);
        self.streaming = true;
        // console.log('w:'+self.video.videoWidth+'/h:'+self.video.videoHeight);
        self.canvas.style.width = self.width + "px";
        self.canvas.style.height = self.height + "px";
        self.canvas.width = self.width;
        self.canvas.height = self.height;
        self.context = self.canvas.getContext("2d");
        self.context.clearRect(0, 0, self.width, self.height);
        // self.imageData = self.context.getImageData(0,0,
        //   self.video.videoWidth,self.video.videoHeight);
      }
    }, false);

    var capture = document.getElementById('capture');
    capture.addEventListener('click', function(ev){
      self.takepicture();
      ev.preventDefault();
    });
  },

  dragenter: function scanner_dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  dragover: function scanner_dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  drop: function scanner_drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;

    this.handleFiles(files);
  },

  handleFiles: function scanner_handleFiles(f) {
    var o=[];
    for(var i =0;i<f.length;i++)
    {
      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          qrcode.decode(e.target.result);
        };
      })(f[i]);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f[i]);
    }
  },

  takepicture: function scanner_takepicture() {
    this.context.drawImage(this.video, 0, 0, this.width, this.height);
    var data = this.canvas.toDataURL('image/png');
    // this.photo.setAttribute('src', data);
  	qrcode.decode();
  },
}

window.addEventListener('load', function onload_scanner() {
  window.removeEventListener('load', onload_scanner);
  QRCodeScanner.init(); 
});