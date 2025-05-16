import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parameters, type ParameterType } from "@/lib/parameter-config";

interface ParameterSelectorProps {
  selectedType: ParameterType;
  selectedParameter: string;
  onTypeChange: (type: string) => void;
  onParameterChange: (parameter: string) => void;
}

export function ParameterSelector({
  selectedType,
  selectedParameter,
  onTypeChange,
  onParameterChange,
}: ParameterSelectorProps) {
  return (
    <div className="flex space-x-4">
      <Select onValueChange={onTypeChange} value={selectedType}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Seleccionar tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="integer">Integer</SelectItem>
          <SelectItem value="float">Float</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={onParameterChange} value={selectedParameter}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Seleccionar parámetro" />
        </SelectTrigger>
        <SelectContent>
          {parameters[selectedType].map((param) => (
            <SelectItem key={param.key} value={param.key}>
              {param.key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
