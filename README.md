# TinaCMS Custom Edit Toolbar Guide

## What's this for?
The default TinaCMS edit bar works well, but out of the box it's not very customizable or styleable. This is a guide that'll walk you through how to replace the edit bar with some custom components, hook into the underlaying functions to recreate the default functionality, and extend it. 

Turning this:

![Old Toolbar](/tinacms-custom-toolbar-guide-images/oldtoolbar.png)

Into this:

![New Toolbar](/tinacms-custom-toolbar-guide-images/newtoolbar.png)

## Getting Started

This guide is designed to be as newbie-friendly as possible. If you're a ninja and want to skip to the good part, hop down to [Make your new Save Reset and Exit Buttons](#Make-your–new-Save-Reset-and-Exit-Buttons).

### Assumptions:
- *You have an install already*: To start out, you need to have a working default install of TinaCMS. For my use-case, we're hooking to a git back-end, so I'm starting with the guide [Using GitHub with Next.js](https://tina.io/guides/nextjs/github/initial-setup/).
- or
- *You have an existing application*: and you want to add custom toolbar functionality.
- We are using TypeScript. If you're unfamiliar with TypeScript, you should be able to just remove the type definitions and it should work fine. 

Once you have a base installation ready, let's get started!

> NOTE: You can check out my [starting codebase here](https://github.com/nstolmaker/tinacms-custom-toolbar/tree/starting_point) to save some steps, but you will still need to get your github tokens and create your own .env file.

## Steps:

1. Disable the default TinaCMS toolbar
2. Remove the default Edit Link
3. Remove references to useGithubToolbarPlugins()
4. Add your own Toolbar component
5. Define your own Custom Toolbar component
6. Make your new EditControls component
7. Make your new Edit Link component
8. Make your own Save, Rest, and Exit components
9. Make your own Branch Selector component
10. Make your own PR component
11. Not Included: Repo Info Plugin
12. All Done!

## Step 1: Remove references to useGithubToolbarPlugins()

First, let's disable the toolbar without breaking the cms. This is pretty straightforward: 

In `pages/_app.tsx`, set toolbar to false. This tells TinaCMS that you don't want to show the toolbar.

![Disable Toolbar in Code](/tinacms-custom-toolbar-guide-images/disabletoolbarcode.png)

## Step 2: Remove Edit Link

Let's remove the default floating Edit Link as well, since we're gonna replace that. (Also in `pages/_app.tsx`).

![Remove Edit Link](/tinacms-custom-toolbar-guide-images/removeeditlink1.png)

And delete it's component definition as well, a bit lower down in the file:
![Remove Edit Component](/tinacms-custom-toolbar-guide-images/removeeditlink2.png)

## Step 3: Remove references to useGithubToolbarPlugins

In `pages/index.tsx` delete the line `useGithubToolbarPlugins()`

![Remove useGithubToolbarPlugins](/tinacms-custom-toolbar-guide-images/usegithubtoolbarplugins.png).

## Step 4: Add your own Custom Toolbar Component

> NOTE: You can check out my [repo with the final code from this guide here](https://github.com/nstolmaker/tinacms-custom-toolbar).

We're going to want to keep track of the custom toolbar's *editing* state, and we need an instance of TinaCMS's `cms` object to pass down to child components like *Save*, or *Branch Selector*. That's pretty easy to do, let's go back into `pages/index.tsx`, and add a hook for *editing* state, and use the TinaCMS hook useCMS() to get an instance of the CMS. Put it right before the return() method begins. Mine was on **line 18**.

```
  const cms = useCMS();
  const [editing, setEditing] = React.useState(false)
```

Below that, just inside of the `<main>` component (right above the h1), let's add our custom component:

`<CustomToolbar cms={cms} editing={editing} setEditing={setEditing} />`

Now our custom toolbar has a reference to cms, and we can keep our edit state status here in this parent-level component, making it easier to access with other parts of the app.

## Step 5: Build the Custom Toolbar Component

This component only needs to do two things: Give us a styled toolbar container, wrap the edit controls, and hide them when we're not in edit mode.

```
import React, { createRef, Ref, useEffect, useRef } from 'react'

// Tina, eat your food!
import { TinaCMS, useCMS, Plugin } from 'tinacms'

// styled components
import styled from 'styled-components';

// components
import EditControls from './EditControls'

type Props = {
  editing: boolean,
  setEditing: (arg0: boolean)=>void,
  cms: TinaCMS | null,
  children?: React.ReactElement | undefined
}

const StyledCustomToolbar = styled.div`
border-bottom: 1px solid #999;
min-height: 4rem;
width: 100%;
position: fixed;
background: #CECECE;
top: 0;
display: flex;
justify-content: space-between;
`

const CustomToolbar = ({children, editing, setEditing, cms }:Props) => {
  
  return (
    <StyledCustomToolbar>
        <h1>TinaCMS Custom Toolbar</h1>
        {(typeof cms === 'object' && (cms !== null && cms.hasOwnProperty('_enabled'))) ? <div style={{display: 'flex'}}>
            <EditControls cms={cms} editing={editing} setEditing={setEditing} />
          </div>
        : <div style={{display: 'flex'}}>empty
          </div>
        }
        {children}
    </StyledCustomToolbar>
  );
}

export default CustomToolbar
```

## Step 6: Make your Edit Controls component
[Here's a link to my EditControls component](https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/EditControls.tsx). 

Yours doesn't need to be as complex at that, it just needs to wrap the child buttons, really. I've put in the `gsap` animation library (`yarn add gsap`), and defined a small animation to give it some pizzazz, but it's not necessary. If you take out the animation stuff, just remember to change the default width value on the wrapper so it's not 0. Easiest just to remove the style={} prop from the lines below:
```
<EditControlsWrapper style={{width: '0'}} ref={containerBackRef}>
```
and
```
<div ref={containerFrontRef}
  style={{display: 'flex', overflow: 'hidden'}}>
  <EditLink cms={cms} editing={editing} setEditing={handleEnterEditing} />
</div>
```

Then, style them to show/hide the edit link however you want.

> Hey Noah! Why add animations? Switching Edit Modes triggers a refresh anyway, so the animations don't even get to finish! <br />On our version we've gone several steps ahead and created a backend proxy for the github requests to route through. We rewrote most of the react-tinacms-github package to do so, and one of the most important things we did was take out the bit that forces the page to refresh when switching edit modes. This makes the experience much slicker and react-y. 

## Step 7: Make your new Edit Link Component

Let's review. So far we have:

- Removed the TinaCMS Toolbar
- Removed the original Edit Link and EditLink Component
- Defined a Custom Toolbar component
- Put our Custom Toolbar into the main container inside `pages/index.tsx`
- Nested our EditControls component inside our Custom Toolbar

![Yes!](https://media.giphy.com/media/uTuLngvL9p0Xe/source.gif)


It's time to start adding the buttons! Let's start with the EditLink component. [Here's a link to my EditLink component](https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/EditLink.tsx#L38). The important part is lines 38-40, where it says:

```
<StyledEditButton 
  onClick={() => { if (!mockEditMode) { setEditing(!editing); cms?.enable() }}}
><StyledEditButtonLabel>Edit Page</StyledEditButtonLabel>
```

> NOTE: What's that mockEditMode thing? My version is designed to support [Storybook](https://storybook.js.org/), which unfortunately TinaCMS struggles with a little bit, due to it's use of hooks. The easiest workaround is to pass an optional mockEditMode prop, which instructs the app not to expect a `cms` object. This way you can click on stuff in Storybook without it crashing. If you're not using storybook, you can ignore mockEditMode, or rip it out.

## Step 8: Make your new Save Reset and Exit Buttons

My components:
- [Link to Github Save](https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/SaveButton.tsx)
- [Link to Github Reset]((https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/ResetButton.tsx))
- [Link to Github Exit]((https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/ExitButton.tsx))

### Save Button

The tricky part starts on line 33.

```
  const handleSave = (e:React.MouseEvent) => {
    console.log("CustomToolbar :: Running Save...")
    if (typeof cms === 'object' && cms !== null) {
      // @ts-ignore
      if (cms.plugins.getType('form')?.all().length > 0) cms.plugins.getType('form')?.all()[0].submit()
    }
  }
```

The cms object exposes plugins. The 'form' plugin is TinaCMS's main form object. This code snippet grabs the first form object and runs it's submit action. TinaCMS exposes these form plugins via this getType('form') method. Running submit will result in a commit--that's all you have to do! 

> NOTE: If you have multiple forms on the page, you may need to carefully iterate them and submit each one in turn. I haven't tested that.

### Reset Button

The reset button works similarly. Interesting code starts on line 32:

```
  const handleReset = () => {
    if (typeof cms === 'object' && cms !== null) {
      // @ts-ignore 
      if (cms.plugins.getType('form').all()?.length > 0) !cms.plugins.getType('form')?.all()[0].pristine && cms.plugins.getType('form')?.all()[0].finalForm.reset()
    }
  }
  ```

  This works the same way the Save function works, except since TinaCMS's form object implementation doesn't have a reset method that's public, so we have to reach down to the FinalForm object that TinaCMS uses under the hood. Thankfully we can do that, since it's exposed as the property '[finalForm](https://final-form.org/react)'. Just call reset() on it, and it'll reset that form.

  ### Exit Button

  The basic exit button is super easy really, you just setEditing(false) and then call cms.disabled(). I've made mine a bit more inteligent--it first checks to see if the form has had any changes to it (what TinaCMS calls *pristine* state), and if there are unsaved changes, it prompts you with a modal warning that you'll lose your work if you don't save first.

  The interesting stuff is on line 53:

  ```
  if (cms.plugins.getType('form').all()?.length > 0) cms.plugins.getType('form')?.all()[0].pristine ? exitEditingMode() : setConfirmExitProps({callback:()=>{cms.plugins.getType('form')?.all()[0].finalForm.reset(); exitEditingMode()}})
  ```

  This is a gross one-liner, but basically it's just saying: are we pristine? Then let them exit. If not, enable the modal by setting confirmExitProps, and pass it a callback that knows how to reset the form and then exit. If you don't do this, it can lead to confusing behavior as it won't revert the content changes until you refresh.


## Step 9: Make your own Branch Switcher component (optional)

The last two components here are a bit more complex. Unlike EditLink/Save/Rest/Exit, the prepackaged Branch Selector and Pull Request components are split out from TinaCMS core and live in the react-tinacms-github package inside 'toolbar-plugins'. 

> NOTE: [Have a look at TinaCMS's repo to see what they look like](https://github.com/tinacms/tinacms/tree/master/packages/react-tinacms-github/src/toolbar-plugins). The good news is that we can pretty much just rip them off as-is and include them in our project. 

- [Here's TinaCMS's BranchSwitcher component](https://github.com/tinacms/tinacms/blob/master/packages/react-tinacms-github/src/toolbar-plugins/BranchSwitcherPlugin.tsx)
- [Here's my Branch Selector component](https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/BranchSelector.tsx)


> NOTE: On Line 72 you can see I've added support for mockEditMode by creating a new empty cms object if one isn't defined. This allows components to be rendered in isolation, like you need for Storybook. Line 103 continues this support, with a default list of branches to show if the GitHub object is falsy.

I've removed the stuff that handles filtering, the CreateBranchModal, and put in my own styling. At this point you've got a lot of control, so do whatever you want in this component!

> NOTE: The Dropdown component is a super simple component I made, you can get it from my repo or just use a normal HTML select instead.

## Step 10: Make your own PR component

This component, much like the Branch Switcher, was ripped from react-tinacms-github, (which is also why it's two files, don't forget `PRModal.tsx`).

### The PR Button

- [TinaCMS's PRPlugin component](https://github.com/tinacms/tinacms/blob/master/packages/react-tinacms-github/src/toolbar-plugins/pull-request/PRPlugin.tsx)
- [My PullRequestButton component]((https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/PullRequestButton.tsx))

Again, I didn't have to change much from the TinaCMS version for it to work. I changed the styles, I removed the PullRequestToolbarWidget object definition, since we're not using TinaCMS's plugin system anymore. Lastly, I moved a little bit of the logic from PRModal into here, because it felt right.

If you want to roll your own, the relevant line is on [line 57](https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/PullRequestButton.tsx#L57) of PullRequestButton, where it says:

```
return await github.createPR(prTitle, prBody)
```

### The PR Modal 

[My PRModal component]((https://github.com/nstolmaker/tinacms-custom-toolbar/blob/main/components/PRModal.tsx)) differs from the one that ships with react-tinacms-github only in one way: my replacement of the AsyncButton with a normal HTML button. It'd be better if it was async, but I've left it like this for now because it's simpler. [Here's the original TinaCMS version](https://github.com/tinacms/tinacms/blob/master/packages/react-tinacms-github/src/toolbar-plugins/pull-request/PRModal.tsx).


## Step 11: Not Included: Repo Info Plugin

I don't have much use for this default toolbar plugin, but if you like it, you should be able to recreate it same as BranchSwitcher and PR, from the react-tinacms-github package's [RepoInfoPlugin.tsx](https://github.com/tinacms/tinacms/blob/master/packages/react-tinacms-github/src/toolbar-plugins/RepoInfoPlugin.tsx).

## Step 12: All Done!

That's it! You should now have a working Custom Toolbar, with an Edit Link that switches out for a panel of edit controls offering: Save, Reset, Exit, Branch Selection, and Pull Request Creation!

> NOTE: You can check out the [final codebase here](https://github.com/nstolmaker/tinacms-custom-toolbar).

How did we do it? By disabling TinaCMS's built-in toolbar stuff, making a handful of components that directly access methods on TinaCMS's `cms` object or the underlaying `FinalForm` object(s), or by replacing components wholesale as we did with the BranchSelector and PR components.

The best part is all of the components are now ours to control, and we can have them do whatever we want! What do you want to do with them?

![Whatever I want](https://media.giphy.com/media/gg4VHcTCsey8U/source.gif)

## Further Thoughts

- I was able to get a custom toolbar working with inline-editing just fine.
- If you're getting errors, I suggest you make absolutely sure that you've set up the GitHub credentials properly, since that's where most of my issues came from. Or, try checking out [my starting point branch](https://github.com/nstolmaker/tinacms-custom-toolbar/tree/starting_point), dropping in the .env file and seeing if that works at least. If not, go back and follow TinaCMS's [Using GitHub with Next.js](https://tina.io/guides/nextjs/github/initial-setup/) guide.
