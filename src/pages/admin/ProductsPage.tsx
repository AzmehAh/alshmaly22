The main issue in this file is a misplaced closing bracket for the categories mapping inside the related products modal. Here's the corrected version of that section:

```jsx
{availableProducts
  .filter(product => !relations.some(rel => rel.related_product_id === product.id))
  .map((product) => (
    <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center">
        <img
          src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'}
          alt={product.name}
          className="h-10 w-10 rounded-lg object-cover mr-3"
        />
        <div>
          <div className="font-medium text-[#054239]">{product.name}</div>
          <div className="text-sm text-gray-500">{product.category?.name}</div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handleAddRelation(showRelationsModal!, product.id, 'related')}
          className="bg-[#b9a779] hover:bg-[#054239] text-white px-3 py-1 rounded text-sm transition-colors duration-200"
        >
          Related
        </button>
        <button
          onClick={() => handleAddRelation(showRelationsModal!, product.id, 'similar')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
        >
          Similar
        </button>
        <button
          onClick={() => handleAddRelation(showRelationsModal!, product.id, 'complementary')}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
        >
          Complementary
        </button>
      </div>
    </div>
  ))}
```

I've removed the misplaced category option element and its associated closing brackets. The rest of the file remains unchanged.