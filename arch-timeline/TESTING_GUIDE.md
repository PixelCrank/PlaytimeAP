# Testing Guide: Architecture Timeline - Children Visibility Fix

## 🎯 What We're Testing
The original issue: "the children aren't showing" when clicking macro movements.

## 📋 Test Steps

### 1. Basic Loading Test ✅
- ✅ Server started on http://localhost:3000
- ✅ Page compiles without errors (200 response)
- **Expected Result**: Timeline loads with header showing movement counts

### 2. Data Loading Verification
**What to look for:**
- Header should show statistics like:
  - "Movements: 5"
  - "Sub-movements: X" 
  - "Works: X"
  - "Figures: X"
- If you see numbers > 0, data loaded successfully!

### 3. 🔍 **Main Test: Children Visibility**
This was the original problem - test this carefully:

**Steps:**
1. Look for macro movement cards (large blocks with names like "Ancient & Classical Traditions", "Medieval & Islamic", etc.)
2. Click on ANY macro movement card
3. **Expected Result**: 
   - Card should expand with animation
   - You should see a "Sub-movements (X)" section
   - Individual child movements should be visible with:
     - Names, date ranges, regions
     - Blue left borders
     - Smooth slide-in animation

**Success Criteria:**
- ✅ Children section expands
- ✅ Child movements are visible and readable
- ✅ Each child shows name, dates, and region
- ✅ Click same macro again to collapse

### 4. Animation & Interaction Test
**Test these behaviors:**
- Click to expand - smooth height/opacity animation
- Click to collapse - smooth animation back to closed
- Only one macro can be expanded at a time
- Plus (+) / minus (-) icons change correctly

### 5. Multiple Movement Test
**Test several movements:**
- "Ancient & Classical Traditions" - should have children like "Ancient Egyptian", "Classical Greek", "Roman Imperial"
- "Contemporary Architecture" - should have "High-tech", "Sustainable Design"
- Each should expand independently

### 6. View Mode Test
**Test the tabs at the top:**
- Click "Timeline" tab (default view)
- Click "Works" tab - should show architectural works
- Click "Figures" tab - should show architectural figures
- All should load data properly

## 🐛 What to Check If Something's Wrong

### If Page Won't Load:
- Check terminal for compilation errors
- Verify server is running on port 3000
- Check if .env.local file exists with correct Sanity credentials

### If No Data Shows:
- Look for "Loading..." spinner initially
- Check if error message appears
- Verify network connection

### If Children Still Don't Show:
- Check browser console (F12) for JavaScript errors
- Verify the macro movement actually has children (check the count in parentheses)
- Try different macro movements

## ✅ Success Indicators

**The fix is working if:**
1. ✅ Timeline loads with movement data
2. ✅ Clicking macro movements expands them
3. ✅ Child movements are visible in expanded sections
4. ✅ Children show proper information (name, dates, region)
5. ✅ Animations work smoothly
6. ✅ Can collapse/expand multiple movements

## 🎉 Expected Behavior

When you click "Ancient & Classical Traditions", you should see something like:
```
Sub-movements (3):
┌─────────────────────────────────────┐
│ Ancient Egyptian                    │
│ 3000 BCE - 30 BCE • Egypt          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Classical Greek                     │
│ 800 BCE - 146 BCE • Greece         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Roman Imperial                      │
│ 27 BCE - 476 CE • Roman Empire     │
└─────────────────────────────────────┘
```

This was the functionality that was broken before - children weren't appearing when clicking macro movements.

---

**Current Status**: Ready for testing! The working timeline should now properly display children when macro movements are clicked.