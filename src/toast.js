/**
 * @author Script47 (https://github.com/Script47/Toast)
 * @description Toast - A Bootstrap 4.2+ jQuery plugin for the toast component
 * @version 1.2.0
 *
 * 6/1/23 TG: Added the granular positions, fixed the omitted delay, added a progressbar if delay is present.
 *
 **/
(function ($) {

    // Map of old positions to new Bootstrap 5 classes
    const POSITION_MAP = {
        'top-right': 'top-0 end-0',
        'top-left': 'top-0 start-0',
        'top-center': 'top-0 start-50 translate-middle-x',
        'bottom-right': 'bottom-0 end-0',
        'bottom-left': 'bottom-0 start-0',
        'bottom-center': 'bottom-0 start-50 translate-middle-x'
    };
    
    // (1) Container
    //     Need to handle the placement, currently hardcoded here
    const TOAST_CONTAINER_HTML = `<div aria-live="polite" aria-atomic="true" class="position-relative">
                                    <div id="toast-container" class="toast-container position-fixed p-1">
                                 </div>
                                 </div>`;
    // (2) Set some defaults
    $.toastDefaults = {
        position: 'top-right',
        dismissible: true,
        stackable: true,
        pauseDelayOnHover: true,
        style: {
            toast: '',
            info: '',
            success: '',
            warning: '',
            error: '',
        }
    };
    // (3) Cleanup function
    $('body').on('hidden.bs.toast', '.toast', function () {
        $(this).remove();
    });
    // (4) Counter
    let toastRunningCount = 1;

    // ============================================================================================
    // (5) Main function
    // ============================================================================================

    function render(opts) {

        // (6) No container, create our own
        if (!$('#toast-container').length) {
            // (7) TODO: Get the new placement
            
            let positionClass = POSITION_MAP[$.toastDefaults.position];
            if (!positionClass) {
                positionClass = 'top-0 end-0';  // Default to top-right if no valid position is found
            }
            $('body').prepend(TOAST_CONTAINER_HTML);
            $('#toast-container').addClass(positionClass);
        }

        // (7) Finalize all the options, merge defaults with what was passed in
        let toastContainer = $('#toast-container');
        let html = '';
        let classes = {
            header: {
                fg: '',
                bg: ''
            },
            body: {
                fg: '',
                bg: ''
            },
            subtitle: 'text-white',
            dismiss: 'text-white'
        };
        let id = opts.id || `toast-${toastRunningCount}`;
        let type = opts.type;
        let title = opts.title;
        let subtitle = opts.subtitle;
        let content = opts.content;
        let img = opts.img;
        let delayOrAutohide = opts.delay ? `data-delay="${opts.delay}"` : `data-bs-autohide="false"`;
        let hideAfter = ``;
        let dismissible = $.toastDefaults.dismissible;
        let globalToastStyles = $.toastDefaults.style.toast;
        let paused = false;

        if (typeof opts.dismissible !== 'undefined') {
            dismissible = opts.dismissible;
        }

        // (8) Set specific class names
        switch (type) {
            case 'primary':
                classes.header.bg = $.toastDefaults.style.info || 'bg-primary';
                classes.header.fg = $.toastDefaults.style.info || 'text-white';
                break;
            case 'secondary':
                classes.header.bg = $.toastDefaults.style.info || 'bg-secondary';
                classes.header.fg = $.toastDefaults.style.info || 'text-white';
                break;
            case 'success':
                classes.header.bg = $.toastDefaults.style.success || 'bg-success';
                classes.header.fg = $.toastDefaults.style.info || 'text-white';
                break;
            case 'error':
            case 'danger':
                classes.header.bg = $.toastDefaults.style.error || 'bg-danger';
                classes.header.fg = $.toastDefaults.style.error || 'text-white';
                classes.body.fg = 'text-black';
                break;
            case 'warning':
                classes.header.bg = $.toastDefaults.style.warning || 'bg-warning';
                classes.header.fg = $.toastDefaults.style.warning || 'text-white';
                break;
            case 'info':
                classes.header.bg = $.toastDefaults.style.info || 'bg-info';
                classes.header.fg = $.toastDefaults.style.info || 'text-white';
                break;
            case 'light':
                classes.header.bg = $.toastDefaults.style.info || 'bg-light';
                classes.header.fg = $.toastDefaults.style.info || 'text-dark';
                break;
            case 'dark':
                classes.header.bg = $.toastDefaults.style.info || 'bg-dark';
                classes.header.fg = $.toastDefaults.style.info || 'text-white';
                break;
        }

        // (9) Set the delay
        if ($.toastDefaults.pauseDelayOnHover && opts.delay) {
            delayOrAutohide = `data-bs-autohide="false"`;
            hideAfter = `data-bs-delay="${Math.floor(Date.now() / 1000) + (opts.delay / 1000)}"`;
        }

        let progressBarHtml = `<div class="progress" style="height: 2px;">
                            <div class="progress-bar" 
                                 role="progressbar" 
                                 aria-valuenow="100" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100"
                                 style="width: 100%;">
                            </div>
                       </div>`;

        // (10) If there is a `title`
        if (title) {
            html = `<div id="${id}" class="toast ${globalToastStyles}" role="alert" aria-live="assertive" aria-atomic="true" ${delayOrAutohide} ${hideAfter}>`;
            html += progressBarHtml;
            _dismissable = '';
            _subtitle = '';
            _img = '';
            if (dismissible) {
                _dismissable = '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>';
            }
            if (subtitle) {
                _subtitle = `<small>${subtitle}</small>`;
            }
            if (img) {
                if(img.class == undefined) img.class = 'rounded me-2'
                _img = `<img src="${img.src}" class="${img.class}" alt="${img.alt}">`;
            }
            // html += `<div class="toast-header">
            //
            //            <strong class="me-auto">${title}</strong>
            //            <small>11 mins ago</small>
            //            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            //          </div>`;
            html += `<div class="toast-header ${classes.header.bg} ${classes.header.fg}">
                        ${_img}
                        <strong class="me-auto">${title}</strong>
                        ${_subtitle}
                        ${_dismissable}
                     </div>`;
            if (content) {
                html += `<div class="toast-body ${classes.body.fg}">
                            ${content}
                         </div>`;
            }
            html += `</div>`;
        // (11) If there is no title, we have to put the color into the actual
        } else {
            html = `<div id="${id}" class="toast ${globalToastStyles} ${classes.header.bg} ${classes.header.fg}" role="alert" aria-live="assertive" aria-atomic="true" ${delayOrAutohide} ${hideAfter}>`;
            if (content) {
                // If we don't have the title, we need to add the dismissable
                if (dismissible) {
                    html += `<div class="d-flex">
                               <div class="toast-body">
                                 ${content}
                               </div>
                               <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                             </div>`;
                } else {
                    html += `<div class="toast-body ${classes.body.fg}">
                               ${content}
                             </div>`;
                }
            }
            html += `</div>`;
        }
        // (12) Set stackable
        if (!$.toastDefaults.stackable) {
            toastContainer.find('.toast').each(function () {
                $(this).remove();
            });
            toastContainer.append(html);
            toastContainer.find('.toast:last').toast('show');
        } else {
            toastContainer.append(html);
            toastContainer.find('.toast:last').toast('show');
        }
        // (13) Deal with the delay
        if ($.toastDefaults.pauseDelayOnHover && opts.delay) {
            setTimeout(function () {
                if (!paused) {
                    $(`#${id}`).toast('hide');
                }
            }, opts.delay);
            $('body').on('mouseover', `#${id}`, function () {
                paused = true;
            });
            $(document).on('mouseleave', '#' + id, function () {
                const current = Math.floor(Date.now() / 1000),
                    future = parseInt($(this).data('hideAfter'));

                paused = false;

                if (current >= future) {
                    $(this).toast('hide');
                }
            });
        }
        if (opts.delay) {
            updateProgressBar(opts.delay, id);
        }
        // (14) Increment the counter
        toastRunningCount++;
    }

    function updateProgressBar(delay, id) {
        let progressBar = $(`#${id} .progress-bar`);
        let timeLeft = delay;
        let total = delay;
        let interval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }
            timeLeft -= 100; // we're using 100ms interval
            progressBar.css('width', `${(timeLeft / total) * 100}%`);
            console.log(`${(timeLeft / total) * 100}%`);
            
        }, 100); // update every 100ms
    }

    /**
     * Show a snack
     * @param type
     * @param title
     * @param delay
     */
    $.snack = function (type, content, delay) {
        return render({
            type,
            content,
            delay
        });
    }

    /**
     * Show a toast
     * @param opts
     */
    $.toast = function (opts) {
        return render(opts);
    }

}(jQuery));
