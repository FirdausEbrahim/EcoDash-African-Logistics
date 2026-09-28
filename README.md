# EcoDash-African-Logistic
A WAS262 HTML5 Canvas simulation about electric medical deliveries in South Africa.

## Project Description 
EcoDash is an interactive HTML5 Canvas game which was based on the challenges of delivering healthcare essentials to rural areas in South Africa. In this game the player controls a solar-powered delivery drone and he must map through a rural enviroment while also managing their battery power and avoiding the given enviromental obstacles. The game demonstrates how drones along with renewable energy could assist with healthcare and delivery in rural regions.

## Main features 
- Solar-Powered Delivery Drone
- Smooth directional movement 
- Acceleration, Velocity and friction
- Drone rotation using Math.sin() and Math.cos()
- Battey consumption system 
- Solar charging zone
- Medical delivery point 
- deliverey counter and score bonus 
- Eneergy efficient score 
- Distance travelled 
- High score using local Storage 
- Moving bird Obstacles
- Wind affecting drone movement
- Rural south African enviroment
- Houses, trees, and a community clinic
- Sound effects
- Start screen 
- Pause screen 
- Gamee Over screeen 
- Restart without refreshing 

## Controls

ENTER -  Start the game
Arrow Up - Move the drone forward
Arrow Down - Move the drne backwards
Arrow Left - Turn left
Arrow Right - Turn Right 
"P" - Pause / Continue game 
"R" - Restart after game over 

## Mathematics and Physics

- Velocity controls how fast the drone will move horizontally and vertically.
- Acceleration gradually increases the drones speed as the player moves.
- Friction slows down the drone the movement keys are released.
- Trigonometry (Math.sin() and Math.cos() ) controls the direction the drone moves based on its angle.
- Pythagoras calculators are used to calculate total speed and bird collision distance.
- Wind force slightly changes the drone’s horizontal movement.
- Battery calculations reduce energy while flying and can then recharge inside the solar charging zone
- AABB collision detection is used for rectangular objects such as the delivery point and the solar charging zone
- Circular distance collision Is used to detect collisions between the drone and the bird

## Installation and setup 
1. Dowload or clone the Github repository 
2. Open up your project folder in VSCode 
3. Make sure the followinf file are in the project folder: 
    - "index.html"
    - "style.css"
    - "script.js"

4. Open "index.html" in a web browser or use Live Server in VSCode 
5. Press "ENTER" to begin playing EcoDash


## Project Structure 

EcoDash-African-Logistics/
|
|-- index.html
|-- style.css
|-- script.js
|-- README.md
|-- documentation/

