import React from 'react';

export function Filters({ onFilterChange, initialFilters, maxAvailablePrice = 1000 }) {
  // Множественный выбор категорий — теперь массив
  const [localCategories, setLocalCategories] = React.useState(initialFilters.categories || []);
  const [localMinPrice, setLocalMinPrice] = React.useState(String(initialFilters.minPrice ?? ''));
  const [localMaxPrice, setLocalMaxPrice] = React.useState(String(initialFilters.maxPrice ?? ''));

  // Ошибки валидации
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const errs = {};
    const min = localMinPrice ? Number(localMinPrice) : undefined;
    const max = localMaxPrice ? Number(localMaxPrice) : undefined;

    // Проверка на отрицательные значения
    if (min !== undefined && min < 0) {
      errs.min = 'Цена не может быть отрицательной';
    }
    if (max !== undefined && max < 0) {
      errs.max = 'Цена не может быть отрицательной';
    }

    // Проверка диапазона
    if (
      min !== undefined && max !== undefined &&
      min >= 0 && max >= 0 &&
      min > max
    ) {
      errs.min = 'Цена «от» не может быть больше цены «до»';
      errs.max = 'Цена «до» не может быть меньше цены «от»';
    }
    return errs;
  };

  const handleApply = () => {
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    onFilterChange({
      categories: localCategories,
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined
    });
  };

  const handleMinChange = (e) => {
    setLocalMinPrice(e.target.value);
    setErrors(prev => ({ ...prev, min: '' }));
  };

  const handleMaxChange = (e) => {
    setLocalMaxPrice(e.target.value);
    setErrors(prev => ({ ...prev, max: '' }));
  };

  // Переключение категории в массиве (чекбоксы)
  const handleCategoryToggle = (category) => {
    setLocalCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categoriesList = [
    { value: 'electronics', label: 'Электроника' },
    { value: 'jewelery', label: 'Ювелирные изделия' },
    { value: "men's clothing", label: 'Мужская одежда' },
    { value: "women's clothing", label: 'Женская одежда' },
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>

        {/* Категории — чекбоксы вместо select */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>Категории</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {categoriesList.map(({ value, label }) => (
              <label
                key={value}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={localCategories.includes(value)}
                  onChange={() => handleCategoryToggle(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Цена от: number + range */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>Цена от</label>
          <input
            type="number"
            value={localMinPrice}
            onChange={handleMinChange}
            placeholder="0"
            min="0"
            max={maxAvailablePrice}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.min ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="range"
            min="0"
            max={maxAvailablePrice}
            step="1"
            value={localMinPrice || 0}
            onChange={handleMinChange}
            style={{ width: '100%', marginTop: '4px' }}
          />
          {errors.min && (
            <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {errors.min}
            </span>
          )}
        </div>

        {/* Цена до: number + range */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px' }}>Цена до</label>
          <input
            type="number"
            value={localMaxPrice}
            onChange={handleMaxChange}
            placeholder={String(maxAvailablePrice)}
            min="0"
            max={maxAvailablePrice}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.max ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="range"
            min="0"
            max={maxAvailablePrice}
            step="1"
            value={localMaxPrice || maxAvailablePrice}
            onChange={handleMaxChange}
            style={{ width: '100%', marginTop: '4px' }}
          />
          {errors.max && (
            <span style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {errors.max}
            </span>
          )}
        </div>

      </div>

      <button
        onClick={handleApply}
        style={{
          padding: '10px 24px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          display: 'block',
          margin: '0 auto'
        }}
      >
        Применить фильтры
      </button>
    </div>
  );
}