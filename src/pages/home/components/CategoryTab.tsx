import { CategoryOptions } from "../types/CategoryOptions";

interface CategoryTabProps {
  tabs: CategoryOptions[];
  selectedCategory: CategoryOptions | null;
  setSelectedCategory: (category: CategoryOptions | null) => void;
}

export default function CategoryTab({ tabs, selectedCategory, setSelectedCategory }: CategoryTabProps) {
  if (!tabs || tabs.length === 0) {
    return <div style={{ textAlign: 'center', padding: '16px' }}>載入中...</div>;
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: '0 16px'
    }}>
      <div style={{ 
        display: 'flex',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '4px',
        gap: '2px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedCategory(tab)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: selectedCategory?.value === tab.value ? '#ffffff' : 'transparent',
              boxShadow: selectedCategory?.value === tab.value ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory?.value !== tab.value) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory?.value !== tab.value) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ 
              fontSize: '16px',
              fontWeight: '500',
              color: selectedCategory?.value === tab.value ? '#111827' : '#374151'
            }}>
              {tab.label}
            </span>
            <span style={{ 
              fontSize: '14px',
              color: selectedCategory?.value === tab.value ? '#4b5563' : '#6b7280'
            }}>
              {tab.subLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
