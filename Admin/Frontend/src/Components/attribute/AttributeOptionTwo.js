import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { showingTranslateValue } from "../../helpers/translate";

const AttributeOptionTwo = ({
  attributes,
  values,
  setValues,
  lang,
  variantTypes,
  initialSelected // Add new prop
}) => {
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [selected, setSelected] = useState(initialSelected || []);

  const handleSelectValue = (items) => {
    setSelected(items);
    setValues({
      ...values,
      [attributes._id]: items.map((el) => el._id), // Remove extra array brackets
      [attributes.value]: items.map((el) => el.label),
      varianttypes: variantTypes
    });
  };

  useEffect(() => {
    const options = attributes?.variants?.map((val) => {
      return {
        ...val,
        label: showingTranslateValue(val?.name, lang),
        value: val?._id,
      };
    });
    setAttributeOptions(options);
  }, [attributes?.variants, lang]);

  return (
    <div>
      <MultiSelect
        options={attributeOptions}
        value={selected}
        onChange={(v) => handleSelectValue(v)}
        labelledBy="Select"
      />
    </div>
  );
};

export default AttributeOptionTwo;
