(function() {
  
    var c1 = document.getElementById( 'c1' ),
      ctx1 = c1.getContext( '2d' ),
      c2 = document.getElementById( 'c2' ),
      ctx2 = c2.getContext( '2d' ),
      twopi = Math.PI * 2,
      parts = [],
      sizeBase,
      cw,
      opt,
      hue,
      count,
      r,g,b,a, tick, ballsCounter,
      constant = 30, rgba, radius, loopCounter,
      speed = 1, offset,
      color1,color2,color3,color4,color5,color6,
      settings, styles = [], centers = 2, centersCoord = [],
      maxSpeed = 3;
  
      var FizzyText = function() {
        this.speed = 10;
        this.particels = 200;
        this.radius = 1.8
        this.color1 = [ 0, 50, 255 ];
        this.color2 = [ 255, 0, 50 ];
        this.color3 = [ 50, 150, 70 ];
        this.color4 = [ 180, 0, 255 ];
        this.color5 = [ 255, 255, 255 ];
        this.alpha = 0.1;
        this.days = 2;
        };
        
        
          settings = new FizzyText();
          var gui = new dat.GUI();
          gui.add(settings, 'radius', 1.8, 10).step(.1).onFinishChange(function(newVal){
            radius = newVal;
            create();
          })
          gui.add(settings, 'speed').min(1).max(10).step(1).onFinishChange(function (newVal){
            speed = newVal;
            create();
          });
          gui.add(settings, 'particels').min(20).max(100).step(10).onFinishChange(function (newVal){
            particels = newVal;
            create();
          });
          gui.add(settings, 'days').min(1).max(12).step(1).onFinishChange(function (newVal){
            days = newVal;
            create();
          });
          gui.addColor(settings, 'color1').onFinishChange(function(newVal){
            color1 = updateValues(newVal);
            create();
          });
          gui.addColor(settings, 'color2').onFinishChange(function(newVal){
            color2 = updateValues(newVal);
            create();
          });
          gui.addColor(settings, 'color3').onFinishChange(function(newVal){
            color3 = updateValues(newVal);
            create();
          });
          gui.addColor(settings, 'color4').onFinishChange(function(newVal){
            color4 = updateValues(newVal);
            create();
          });
          gui.addColor(settings, 'color5').onFinishChange(function(newVal){
            this.initialValue = newVal
            create();
          });
          
        
    function trueRand( lowest, highest){
        var adjustedHigh = (highest - lowest) + 1;       
        return Math.floor(Math.random()*adjustedHigh) + parseFloat(lowest);
    }

    function rand( min, max ) {
      return Math.random() * ( max - min ) + min;
    }
  
    function hsla( h, s, l, a ) {
      return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
    }
  
    function updateValues(color){
      for(var i=1; i < color.length; i++){
        color[i] = parseInt(color[i]);
      }
      return color;
    }

    function create() {
      loopCounter = 0;
      ballsCounter = Math.floor( ( cw + ch + constant) * 0.03 );
      if (settings.particels) {
        ballsCounter = settings.particels;
      }
      if (settings.days){
        centers = settings.days;
      }

      if (settings.speed){
        speed = settings.speed;
      }

      if (settings.radius) {
        radius = settings.radius
      }

      var clr;
      parts.length = 0;
      styles = []
      for(var j=1; j <= 5; j++){
        clr = 'color' + j;
        styles.push(settings[clr]);
      }
      centersCoord = createOrigins(centers, cw, ch);
      for(var j=0; j < centers; j++){
        offset = trueRand(-10,10);        
        for( var i = 0; i < ballsCounter/centers; i++ ) {
          styleIdx = trueRand(0, 4);
          fillStyle = styles[styleIdx];
          tick = trueRand( 0, 1000 );
          a = Math.cos(tick * i ) * 0.3;
          
          parts.push({
            id: i,
            centerNum: j,
            radius: radius,
            x: centersCoord[j].x,
            y: centersCoord[j].y,
            angle: trueRand(0,twopi),
            vel: parseInt(rand( 0.2, speed )),
            tick: tick,
            fillStyle: fillStyle,
            opacity: 0,
            speed: Math.max(Math.random() * maxSpeed, 1),
            grow: 1
          });
        }
      }

      var d = 0;
      
    }
  
    function init() {
      resize();
      create();
      setInterval(loop, 30);
    }
  
    function loop() {
      ctx2.clearRect( 0, 0, cw, ch );
      ctx2.globalCompositeOperation = 'source-over';
      ctx2.shadowBlur = 0;
      ctx2.drawImage( c1, 0, 0 );
      ctx2.globalCompositeOperation = 'lighter';
  
      var i = parts.length, fillStyle;
      ctx2.shadowBlur = 25;
      ctx2.shadowColor = '#fff';
      
      while( i-- ) {
        var part = parts[ i ];
        part.x += Math.cos( part.angle ) * part.vel ;
        part.y += Math.sin( part.angle ) * part.vel;
      
        ctx2.beginPath();
        ctx2.arc( part.x, part.y, part.radius, 0, twopi );

        fillStyle = 'rgba(' + part.fillStyle.join(',') + ',' + part.opacity + ')';
      
    
        ctx2.fillStyle = fillStyle;
  
  
        ctx2.fill();
        loopCounter++;
        part = update(part);
      
      }
    }
  
    function update(part){
      part.opacity = part.opacity + part.speed / 100;
      if( part.x > cw ) { 
        // part.x = cw/2; 
        part.x = centersCoord[part.centerNum].x
        // part.y = ch/2;
        part.y = centersCoord[part.centerNum].y
        part.vel = part.vel/2;
        part.opacity = 0;
      }
      if( part.x + part.radius < 0 )  { 
        // part.x = cw/2 
        part.x = centersCoord[part.centerNum].x
        // part.y = ch/2
        part.y = centersCoord[part.centerNum].y
        part.vel = part.vel/2;
        part.opacity = 0
      }
      if( part.y > ch ) { 
        // part.y = ch/2 
        part.y = centersCoord[part.centerNum].y
        // part.x = cw/2
        part.x = centersCoord[part.centerNum].x
        part.vel = part.vel/2;
        part.opacity = 0
      }
      if( part.y + part.radius < 0 )  { 
        // part.y = ch/2 
        part.y = centersCoord[part.centerNum].y
        // part.x = cw/2
        part.x = centersCoord[part.centerNum].x
        part.vel = part.vel/2;
        part.opacity = 0
      }
      
      part.vel +=.01
      if (part.vel > speed) {
        part.vel = part.vel/2;
      }
          
  
       part.angle += trueRand( -0.01, 0.01 );

      part.tick++;
    }

    function generateRandomCoordinates(width,height){
      var pos = {},x,y;
      var randsize = ((Math.random()*100) + 250).toFixed();
      x = (Math.random() * (width - randsize)).toFixed();
      y = (Math.random() * (height - randsize) + 50).toFixed() ;
      pos.x = x;
      pos.y = y;
    
      return pos;
    }

    function createOrigins(origins, cw, ch) {
      originsCenters = [];
      var pos;
      
      for (var i = 0; i < origins; i++) {
        pos = generateRandomCoordinates(cw, ch);
        originsCenters.push({
          x: parseInt(pos.x),
          y: parseInt(pos.y),
        });
      
      }
      return originsCenters;
    }

    function resize() {
      cw = c1.width = c2.width = window.innerWidth,
      ch = c1.height = c2.height = window.innerHeight;
    }
  
    function click() {
      create()
    }
  
    // window.addEventListener( 'resize', resize );
    // window.addEventListener( 'click', click );
  
    init();
  })();