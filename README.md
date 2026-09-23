# Sorting Visualizer

Angular-powered web app capable of visually representing various sorting algorithms using bars of varying heights. As the sorting algorithm runs, the app updates the color and height of the bars to reflect the current state of the sorting process and also plays a tone based on the height of the bar at the current index.

Visit the [GitHub pages](https://jarvisar.github.io/sorting-algos/) site to access the latest deployment.

Also available as an [Android APK](https://github.com/jarvisar/sorting-algos/tree/ionic-mobile).

## Usage

Currently this web application supports the following sorting algorithms:


-  Bubble Sort
-   Selection Sort
-   Insertion Sort
-   Merge Sort
-   Quick Sort
-   Dual-Pivot Quick Sort
-   Introsort
-   Heap Sort
-   Radix Sort (LSD)
-   Radix Sort (MSD)
-   Bitonic Sort
-   Cocktail Shaker
-   Odd-Even Sort
-   Comb Sort
-   Circle Sort
-   Gnome Sort
-   Shell Sort
-   Cycle Sort
-   Counting Sort
-   Tim Sort
-   Strand Sort
-   Pancake Sort
-   Stooge Sort
-   Bogo Sort

Learn more about sorting algorithms here: https://www.geeksforgeeks.org/sorting-algorithms/

Use the input box to enter the number of bars on the screen. Currently the maximum amount is 512.

Click `Sort` to begin sorting. Click `Stop` at any time to halt the sorting process. Click `Reset` to regenerate new bars.

Control the speed of the sorting process with the slider.

## Local Installation

To install and run this app on a local machine, follow these steps:

1. Clone the repository to the local machine using the command:

`git clone https://github.com/jarvisar/sorting-algos.git`

2. Navigate to the project directory using the command:

`cd sorting-algos`

3. Install the necessary dependencies using the command:

`npm install`

4. If necessary, install Angular CLI:

`npm i @angular/cli`

5. Start the app using the command:

`ng serve`

6. Open a web browser and navigate to `http://localhost:4200` to view the app.

## Progressive Web App

The production build supports installation and offline use. Open the app online once and let its service worker finish caching before going offline. Sorting runs locally; external help and source-code links still need an internet connection. Google fonts and Material icons are cached as they are requested while the service worker controls the page.

To install, use your browser's install option (for example, the install icon in Chrome or Edge). On iPhone or iPad, open the site in Safari and choose **Share > Add to Home Screen**.

Service workers require HTTPS in deployment; localhost also works for testing. The development server (`npm start`) does not register the service worker. To test locally:

```sh
npm run build
npx http-server dist/sorting-algos -p 8080 -c-1
```

Open `http://localhost:8080`, wait for the service worker to activate, then reload so it controls the page. In browser developer tools, check **Application > Manifest** and **Service Workers**, then switch **Network** to **Offline** and reload to verify offline use.

For GitHub Pages, build with the deployment path:

```sh
npm run build -- --base-href /sorting-algos/
```

Publish the contents of `dist/sorting-algos` at `/sorting-algos/`. Manifest URLs are relative to the deployed app, and Angular applies the build's base URL to the service worker's cache paths automatically.

###### This web app was created with [Angular v14.3.0](https://angular.io/)

## Screenshots

<p align="center">
 
 <kbd>
  <img src="https://jarvisar.github.io/assets/img/portfolio/portfolio-12-1.png" alt="Home Page" title"Home Page" width="750">
 </kbd>
 
<br>
Home Page
<br>
<br>

<kbd>
  <img src="https://jarvisar.github.io/assets/img/portfolio/portfolio-12-4.gif" alt="Radix Sort" title"Radix Sort" width="750">
</kbd>

<br>
Radix Sort
<br>
<br>

<kbd>
 <img src="https://jarvisar.github.io/assets/img/portfolio/portfolio-12-5.gif" alt="Bitonic Sort" title"Bitonic Sort" width="750">
</kbd>
<br>
Bitonic Sort
<br>
<br>

<kbd>
 <img src="https://jarvisar.github.io/assets/img/portfolio/portfolio-12-6.gif" alt="Cocktail Sort" title"Cocktail Sort" width="750">
</kbd>
<br>
Cocktail Sort
</p>
