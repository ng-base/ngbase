### Edge cases documentation

When a radio group is inside a popup, when user applies a popoverClose to the radio item, then clicking a radio item the popup closes before selecting the radio item. This happens because the we are trigger click on focusIn triggers and it tries to select the first item by default.
