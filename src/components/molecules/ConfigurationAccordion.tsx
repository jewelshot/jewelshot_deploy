import { SelectionDropdown } from '@/components/atoms/SelectionDropdown';

interface ConfigurationAccordionProps {
  gender: string | null;
  jewelryType: string | null;
  onGenderChange: (value: string) => void;
  onJewelryChange: (value: string) => void;
  genderOptions: Array<{ value: string; label: string }>;
  jewelryOptions: Array<{ value: string; label: string }>;
}

/**
 * ConfigurationAccordion - Simple side-by-side dropdowns for gender/jewelry selection
 */
export function ConfigurationAccordion({
  gender,
  jewelryType,
  onGenderChange,
  onJewelryChange,
  genderOptions,
  jewelryOptions,
}: ConfigurationAccordionProps) {
  const isJewelryDisabled = !gender;
  const isComplete = gender && jewelryType;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2 transition-all duration-300">
        {/* Gender Selection */}
        <div className="flex-1">
          <SelectionDropdown
            label=""
            placeholder="Gender"
            options={genderOptions}
            value={gender}
            onChange={onGenderChange}
          />
        </div>

        {/* Jewelry Type Selection */}
        <div className="flex-1">
          <SelectionDropdown
            label=""
            placeholder="Jewelry"
            options={jewelryOptions}
            value={jewelryType}
            onChange={onJewelryChange}
            disabled={isJewelryDisabled}
          />
        </div>
      </div>
    </div>
  );
}
