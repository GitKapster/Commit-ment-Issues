function mode(e){
    if(e.className != 'active mode'){
      document.querySelectorAll('.modes .mode')[0].className = 'mode';
      document.querySelectorAll('.modes .mode')[1].className = 'mode';
      e.className = 'active mode';
      app.$data.mode = e.innerText;
    }
    else {
      e.className = 'active mode';
      app.$data.mode = e.innerText;
    }
  }
  
  function sensitivity(e){
    if(e.className != 'active sensitivity'){
      document.querySelectorAll('.sensitivities .sensitivity')[0].className = 'sensitivity';
      document.querySelectorAll('.sensitivities .sensitivity')[1].className = 'sensitivity';
      document.querySelectorAll('.sensitivities .sensitivity')[2].className = 'sensitivity';
      e.className = 'active sensitivity';
      app.$data.sensitivity = e.innerText;
    }
    else {
      e.className = 'active sensitivity';
      app.$data.sensitivity = e.innerText;
    }
  }
  
  var app = new Vue({
      el: '#app',
      data: {
        x: 0,
        y: 0,
        scoresCount: 0,
        finalScores: 0,
        started: false,
        finished: false,
        mode: 'Easy',
        sensitivity: 'Medium'
      },
      methods: {
        startGame: function(){
            this.started = true;
            
            let circuleContainer = document.querySelector('.circules');
            let container = document.querySelector('.container');
            
            // Clear any existing circles
            circuleContainer.innerHTML = '';
            
            // Setup game area
            container.style.height = '80vh';
            container.style.width = '90%';
            
            // Calculate positions for targets
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            
            // Get game speed based on difficulty
            let speed = this.mode === 'Easy' ? 2000 : 1500;
            
            // Start creating targets
            let counter = 0;
            let interval = setInterval(() => {
              if(counter < 30){
                // Create a new target
                this.createTarget(containerWidth, containerHeight);
                counter++;
              } else {
                // Game finished
                clearInterval(interval);
                this.finishGame();
              }
            }, speed);
        },
        
        createTarget: function(containerWidth, containerHeight){
          let circuleContainer = document.querySelector('.circules');
          
          // Ensure targets aren't too close to edges
          const margin = 40; 
          const x = margin + Math.random() * (containerWidth - 2 * margin);
          const y = margin + Math.random() * (containerHeight - 2 * margin);
          
          // Create target element
          const target = document.createElement('div');
          target.className = 'hitMe';
          target.style.left = `${x}px`;
          target.style.top = `${y}px`;
          
          // Handle clicks on target
          target.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Prevent container click
            this.scoresCount++;
            circuleContainer.removeChild(target);
          });
          
          circuleContainer.appendChild(target);
        },
        
        finishGame: function(){
          this.finalScores = this.scoresCount;
          this.scoresCount = 0;
          
          // Save score to database if user is logged in
          const saveScore = async () => {
            try {
              const response = await fetch('/aim-trainer/save-score', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  score: this.finalScores,
                  difficulty: this.mode.toLowerCase()
                })
              });
              
              const result = await response.json();
              console.log('Score saved:', result);
            } catch (error) {
              console.error('Error saving score:', error);
            }
          };
          
          saveScore();
          
          setTimeout(() => {
            this.finished = true;
          }, 500);
        },
        
        mouseMove: function(e){
          this.x = e.offsetX;
          this.y = e.offsetY;
        },
        
        mouseDown: function(){
          // This handles clicks on the container (missed targets)
          // Target clicks are handled by the target elements themselves
        }
      }
  });