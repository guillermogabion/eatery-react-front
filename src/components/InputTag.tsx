var currentThis:any = this;
var __rest = (currentThis && currentThis.__rest) || function (s:any, e:any) {
    var t:any = {};
    var p:any;
    for (p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p:any = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classnames from 'classnames';
export default function Cancel(props:any) {
    return (React.createElement("svg", Object.assign({ width: '24', height: '24', viewBox: '0 0 24 24' }, props),
        React.createElement("path", { d: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z' })));
}
export const InputTags = (_a:any) => {
    var { placeholder, values, onTags, name, className, elementClassName } = _a, rest = __rest(_a, ["placeholder", "values", "onTags", "name", "className", "elementClassName"]);
    const [terms, setTerms] = useState(values);
    const [value, setValue] = useState('');
    const [focusIndex, setFocusIndex] = useState(-1);
    const inputRef:any = useRef(null);
    const forceInputFocus = () => {
        if (inputRef.current && focusIndex === -1) {
            inputRef.current.focus();
        }
    };
    useLayoutEffect(() => {
        if (terms.length === 0) {
            setFocusIndex(-1);
        }
        onTags({ values: terms, name: name });
    }, [terms.length]);
    useEffect(() => {
        setTerms(values || []);
    }, [values]);
    useEffect(() => {
        forceInputFocus();
    }, [focusIndex, inputRef.current]);
    const onchange = (event:any) => {
        setValue(event.currentTarget.value);
    };
    const onkeydown = (event:any) => {
        const { key } = event;
        const currentValue = value.trim();
        if (key === 'Tab' && currentValue !== '') {
            event.preventDefault();
            setTerms([...terms, currentValue.replace(',', '')]);
            setValue('');
            setFocusIndex(-1);
        }
    };
    const onkeyup = (event:any) => {
        const { key } = event;
        
        
        const currentValue = value.trim();
        const valueLength = currentValue.length;
        const currentTarget = event.currentTarget.selectionEnd || 0;
        const isEndOfText = currentTarget > valueLength;
        const isStartOfText = currentTarget === 0;
        const isPossibletermsMove = terms.length > 0;
        const isPossibleAddKeys = key === 'Enter' || key === ' ' || key === 'Tab' || key === ',';
        if (isPossibleAddKeys && currentValue !== '') {
            event.preventDefault();
            setTerms([...terms, currentValue.replace(',', '')]);
            setValue('');
            setFocusIndex(-1);
        }
        else if (isStartOfText &&
            (key === 'Backspace' || key === 'ArrowLeft') &&
            isPossibletermsMove) {
            event.preventDefault();
            setFocusIndex(terms.length - 1);
        }
        else if (isEndOfText && key === 'ArrowRight' && isPossibletermsMove) {
            event.preventDefault();
            setFocusIndex(0);
        }
    };
    const handleRemove = (index:any, focus:any) => {
        setTerms(terms.filter((_:any, i:any) => i !== index));
        if (focus) {
            setFocusIndex(Math.max(focusIndex - 1, 0));
        }
        else {
            forceInputFocus();
        }
    };
    const setSelectedIndex = (index:any) => {
        if (index < terms.length && index > -1) {
            setFocusIndex(index);
        }
        else {
            setFocusIndex(-1);
        }
    };
    return (React.createElement("div", { className: 'form-control h-auto d-inline-flex flex-wrap' },
        terms.map((item:any, index:any) => {
            const focus = focusIndex === index;
            return (React.createElement(Element, { key: `${item}${index}`, value: item, index: index, onRemove: handleRemove, focus: focus, onSelectedIndex: setSelectedIndex, className: elementClassName }));
        }),
        React.createElement("input", Object.assign({ "data-testid": 'input-tags', ref: inputRef, type: 'text', className: classnames('border-0 w-auto flex-fill input-tags', className), placeholder: placeholder, "aria-label": placeholder, value: value, onChange: onchange, onKeyUp: onkeyup, onKeyDown: onkeydown, autoFocus: true, name: name }, rest))));
};
const Element = (props:any) => {
    const [focus, setFocus] = useState(false);
    const onclick = () => {
        props.onRemove(props.index, focus);
    };
    const ref:any = useRef(null);
    useLayoutEffect(() => {
        if (ref.current && props.focus) {
            ref.current.focus();
        }
    }, [props.focus]);
    const onkeydown = (event:any) => {
        const { key } = event;
        event.preventDefault();
        if (key === 'Backspace' || key === 'Delete') {
            props.onRemove(props.index, props.focus);
        }
        else if (key === 'ArrowLeft') {
            props.onSelectedIndex(props.index - 1);
        }
        else if (key === 'ArrowRight') {
            props.onSelectedIndex(props.index + 1);
        }
    };
    return (React.createElement("div", { "data-testid": 'tag-element', ref: ref, tabIndex: 0, className: classnames('badge bg-secondary bg-gradient me-1 pe-1 justify-content-between', props.className), onKeyUp: onkeydown, onFocus: () => {
            setFocus(true);
        }, onBlur: () => {
            setFocus(false);
        } },
        props.value,
        React.createElement("button", { "data-testid": 'tag-clean-element', type: 'button', "aria-label": 'remove path fragment', tabIndex: -1, className: 'border-0 bg-transparent ps-auto pe-0', style: { outline: 0 }, onClick: onclick },
            React.createElement(Cancel, { style: { fill: 'var(--bs-vlack)', opacity: 1 }, width: 18, height: 18 }))));
};


