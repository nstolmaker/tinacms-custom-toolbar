// React/Next/Tina
import React from 'react';


type DropdownPropTypes = {
        children?: React.ReactElement,
} & React.HTMLProps<HTMLDivElement>  // this allows the rest of any valid HTML properties to come through

const Dropdown = ({children, ...rest}: DropdownPropTypes) => {
    return <div {...rest}>{children}</div>
};

export default Dropdown;