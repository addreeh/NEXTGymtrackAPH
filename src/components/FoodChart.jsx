import { LabelList, Pie, PieChart } from 'recharts'
import { getCalories } from '../../lib/calories'
import { getUser } from '../../lib/supabase'
import { IconLoadBalancer, IconMeat } from '@tabler/icons-react'

const chartConfig = {
  grams: {
    label: 'Gramos'
  },
  carbohidratos: {
    label: 'Carbohidratos',
    color: '#3174F1'
  },
  proteinas: {
    label: 'Proteína',
    color: '#E92D18'
  },
  grasas: {
    label: 'Grasas',
    color: '#F6AD01'
  }
}

const calculateMacroData = (calories) => {
  const carbs = calories.macro.carbs * 4
  const protein = calories.macro.protein * 4
  const fat = calories.macro.fat * 9

  const carbsPerc = (carbs / calories.tmb) * 100
  const proteinPerc = (protein / calories.tmb) * 100
  const fatPerc = (fat / calories.tmb) * 100

  return [
    { name: 'Carbohidratos', grams: Math.trunc(carbsPerc), fill: '#3174F1' },
    { name: 'Proteina', grams: Math.trunc(proteinPerc), fill: '#E92D18' },
    { name: 'Grasas', grams: Math.trunc(fatPerc), fill: '#F6AD01' }
  ]
}

export default function FoodChart ({ user }) {
  const foodData = caloriesData ? calculateMacroData(caloriesData) : []

  return (
    <ChartContainer
      config={chartConfig}
      className='mx-auto aspect-square max-h-[250px]'
    >
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey='grams' hideLabel />}
        />
        <Pie data={foodData} dataKey='grams'>
          <LabelList
            dataKey='name'
            className='fill-background'
            stroke='none'
            fontSize={12}
          />
        </Pie>
      </PieChart>
    </ChartContainer>

  )
}
