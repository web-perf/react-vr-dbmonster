# React VR

React VR is a framework for the creation of VR applications that run in your web browser. It pairs modern APIs like WebGL and WebVR with the declarative power of [React](https://facebook.github.io/react), producing experiences that can be consumed through a variety of devices.
**Please note that this project is currently an alpha release, and APIs are subject to change.**

## Getting Started with React VR

If you already have Node.js (≥4.0) installed, you can download the React VR command line tool from npm:

```
npm install -g react-vr-cli
```

Once this is installed, you can create a new VR project by running

```
react-vr init PROJECT_NAME
```

where `PROJECT_NAME` is the name of your application. Once it's been created and the dependencies are installed, start the application server by running

```
npm start
```

When the server has booted, you can access your application in your default web browser by running npm run open or by simply navigating to [http://localhost:8081/vr/](http://localhost:8081/vr/). Your application's code can be found in `index.vr.js`.

## Opening Issues

If you encounter a bug with React VR we would like to hear about it. Search the [existing issues](https://github.com/facebookincubator/react-vr/issues) and try to make sure your problem doesn’t already exist before opening a new issue. It’s helpful if you include the version of React VR, Browser, and OS you’re using. Please include a stack trace and reduced repro case when appropriate, too.

## License

React is BSD licensed (LICENSE). We also provide an additional patent grant (PATENTS).

React documentation is Creative Commons licensed (LICENSE-docs).

Examples provided in this repository and in the documentation are separately licensed (LICENSE-examples).
