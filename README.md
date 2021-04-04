# bootstrap5-toast

Copied from https://github.com/Script47/Toast and updated to support Bootstrap 5.x
https://getbootstrap.com/docs/5.0/components/toasts/
as a proof of concept (not complete)

* [About](#about)
* [Usage](#usage)
    * [Live Example](https://jsfiddle.net/47n5ygth/)
* [Contributing](#contributing)

### About

* Makes Bootstrap 5.x Toasts easier to use
* Requires jQuery 3.x
* TODO: Placement/Position is hardcoded to top-right `top-0 start-0`
* TODO: Rounded square in the `toast-header` similar to Bootstrap documentation
* TODO: Image
* TODO: Investigate `delay`, does not seem to be working

Code for Rounded square in Header

```html
<div class="toast-header">
  <svg class="rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg"   preserveAspectRatio="xMidYMid slice" focusable="false" role="img">
    <rect fill="#007aff" width="100%" height="100%" />
  </svg>
  ...
</div>
```

### Usage

* Only need the JS file, all the CSS is from Bootstrap 5.x

```html
<script src="src/toast.js"></script>
```

### Globals (Not 100% Implemented)

Modify the global variables to apply specific rules/styles to all your toasts.

```javascript
$.toastDefaults = {
    position: 'top-right', /** top-left/top-right/top-center/bottom-left/bottom-right/bottom-center - Where the toast will show up **/
    dismissible: true, /** true/false - If you want to show the button to dismiss the toast manually **/
    stackable: true, /** true/false - If you want the toasts to be stackable **/
    pauseDelayOnHover: true, /** true/false - If you want to pause the delay of toast when hovering over the toast **/
    style: {
        toast: '', /** Classes you want to apply separated my a space to each created toast element (.toast) **/
        info: '', /** Classes you want to apply separated my a space to modify the "info" type style  **/
        success: '', /** Classes you want to apply separated my a space to modify the "success" type style  **/
        warning: '', /** Classes you want to apply separated my a space to modify the "warning" type style  **/
        error: '', /** Classes you want to apply separated my a space to modify the "error" type style  **/
    }
};
```

### Snack

A "snack" is a bitesized "toast".  

```javascript
$.snack(type, content, delay)
```

<img src="https://i.gyazo.com/165671094c4c956bf89a05f4d9f089b1.png">

**Note:** The final argument `delay` is omitable. If omitted, the toast will remain forever.

### Toast (Not 100% Implemented)

```javascript
$.toast({
    type: 'info',
    title: 'Notice!',
    subtitle: '11 mins ago',
    content: 'Hello, world! This is a toast message.',
    delay: 5000,
    img: {
        src: 'https://via.placeholder.com/20',
        class: 'rounded-0', /**  Classes you want to apply separated my a space to modify the image **/
        alt: 'Image'
    }
});
```

<img src="https://i.gyazo.com/63c444e180d5d18ef8a71df2969cc0cc.png">

### Contributing

Feel free to contribute in any of the ways outlined:

- Submit issues/pull requests
- Tell us how you're using this plugin in *your* project
