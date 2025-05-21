const ProductSpecs = ({ specs }) => {
    if (!specs) return null;
    
    return (
        <div className='specs-block'>
        <h3>Характеристики товара:</h3>
      <ul className="product-specs">
        {Object.entries(specs).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
      </div>
    );
  };
  export default ProductSpecs;