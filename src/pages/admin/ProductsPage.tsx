Here's the fixed version with the missing closing brackets and tags added:

```jsx
import React, { useState, useEffect } from 'react';
// [previous imports remain the same...]

const ProductsPage = () => {
  // [previous state and functions remain the same...]

  return (
    <div className="space-y-6">
      {/* [previous JSX remains the same until the categories mapping...] */}
      
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.name}{category.name_ar ? ` | ${category.name_ar}` : ''}
        </option>
      ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* [rest of the modals and JSX remain the same...] */}
    </div>
  );
};

export default ProductsPage;
```

I've added the missing closing tags and brackets that were needed to properly close the nested structure in the component. The main issues were in the categories mapping section where several closing tags were missing. The fixed version maintains the proper nesting and structure of the component.