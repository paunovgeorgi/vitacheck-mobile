import { PERIODS } from "@/constants";

export type Supplement = {
  id: string;
  name: string;
  dosage: string;
  reasoning: string;
  relation: string;
  time: string;  
}

export interface createSupplementInterface {
  name: string;
  dosage: string;
  reasoning: string;
  relation: string;
  time: string;
};

export enum TimeOfDay {
    morning = "Morning",
    noon = "Noon",
    evening = "Evening"
};

export enum FoodRelation {
    BEFORE = 'Before Eating',
    WITH = 'With Food',
    AFTER = 'After Eating',
}

export type FoodRelationType = `${FoodRelation}`;

export type Period = (typeof PERIODS)[number];

export type CommonSupplement = {
    name: string;
    dosage: string;
};
