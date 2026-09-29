# Flappy Bird

A simple Flappy Bird game built with Java Swing.

The project also includes a mobile-friendly browser version that can be opened
on Android or iPhone without installing an app.

## Requirements

- Java Development Kit (JDK) 8 or newer
- VS Code with the Extension Pack for Java, if using VS Code

## Run from VS Code

1. Open the project folder in VS Code.
2. Open `App.java`.
3. Click the **Run** link above the `main` method.

If VS Code cannot find the `App` class, run **Java: Clean Java Language
Server Workspace** from the Command Palette, choose **Restart and delete**,
and then run the application again.

Do not use the **Run Code** button from the Code Runner extension.

## Run from a terminal

From the project folder, run:

```bash
mkdir -p bin
javac -d bin App.java FlappyBird.java
java -cp bin:. App
```

## Controls

- **Space**: flap
- **P**: pause or resume
- **Space after Game Over**: restart

The game displays the current score and the highest score achieved during the
current session.

## Run on a phone

The browser version consists of `index.html`, `style.css`, and `game.js`.
It uses the existing PNG assets and supports tapping to flap, pausing, and a
persistent high score in the browser.

To test it locally, open `index.html` in a browser. For a career fair, publish
the project folder with a static hosting service such as GitHub Pages, then
open the generated website URL on a phone.

## Project files

- `App.java`: creates the game window
- `FlappyBird.java`: game logic, rendering, controls, scoring, and pause menu
- `flappybirdbg.png`: background image
- `flappybird.png`: bird image
- `toppipe.png` and `bottompipe.png`: pipe images
