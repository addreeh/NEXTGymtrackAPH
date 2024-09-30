export const renderDescription = ({ selectedExercise }) => {
  if (!selectedExercise) return

  if (selectedExercise.series) {
    switch (true) {
      case selectedExercise.series.includes('TARGET'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>SERIE TARGET</h4>
            <p className='text-card-text text-xs text-pretty pt-2'>3 series con el mismo peso y 90 segundos de descanso</p>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>1ª Serie: 12 repeticiones</li>
              <li>2ª Serie: 10 repeticiones</li>
              <li>3ª Serie: 8 repeticiones</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('DROPSET'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>DROPSET</h4>
            <p className='text-card-text text-xs pt-2 text-pretty'>Reducir el peso después de alcanzar el fallo muscular y continuar con las repeticiones.</p>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>1ª Tanda: Hasta el fallo</li>
              <li>2ª Tanda: Reduce un 20% el peso y repite hasta el fallo</li>
              <li>3ª Tanda: Reduce otro 20% el peso y repite hasta el fallo</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('REST PAUSE'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>REST PAUSE</h4>
            <p className='text-card-text text-xs pt-2 text-pretty'>Realiza series cortas con descansos breves para maximizar la fatiga muscular.</p>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>1ª Serie: 6-8 repeticiones</li>
              <li>Descanso: 10-15 segundos</li>
              <li>Repetir hasta completar 3 tandas</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('LINEAL'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>SERIE LINEAL</h4>
            <p className='text-card-text text-xs pt-2 text-pretty'>Mismo número de repeticiones y peso en cada serie.</p>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>3 series de 10 repeticiones con el mismo peso</li>
              <li>Descanso de 60-90 segundos entre series</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('SUPERSERIE') || selectedExercise.series.includes('SUPER SERIE'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>SUPERSERIE</h4>
            <p className='text-card-text text-xs pt-2 text-pretty'>Realiza dos ejercicios de forma consecutiva sin descanso entre ellos.</p>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>1º Ejercicio: 10-12 repeticiones</li>
              <li>Sin descanso, pasa al siguiente ejercicio</li>
              <li>2º Ejercicio: 10-12 repeticiones</li>
              <li>Descanso de 60-90 segundos después de ambos ejercicios</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('TS') || selectedExercise.series.includes('BOS'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>TOPSET & BACKOFF SET</h4>
            <p className='text-card-text text-xs pt-2 text-pretty'>Combina una serie pesada con series de descarga para maximizar la intensidad y el volumen.</p>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>Topset: Serie pesada de 5-8 repeticiones al 90-95% de tu 1RM</li>
              <li>Backoff Set: Serie de 8-12 repeticiones reduciendo el peso un 20-30%</li>
              <li>Descanso de 2-3 minutos entre la Topset y las Backoff Sets</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('2 - 1 SLOW'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>2 + 1 SLOW</h4>
            <p className='text-card-text text-xs pt-2 text-pretty'>Realiza dos repeticiones rápidas seguidas de una repetición lenta para aumentar la intensidad y el tiempo bajo tensión.</p>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>2 repeticiones a tempo normal</li>
              <li>1 repetición lenta con un tempo de 3-4 segundos en la fase excéntrica y concéntrica</li>
              <li>Realizar las repeticiones lentas en aquellas que sean múltiplo de tres (3, 6, 9, ...)</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('JUMPSET'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>JUMPSET</h4>
            <p className='text-card-text text-xs pt-2 text-pretty'>Alterna entre diferentes ejercicios con descanso de 45&ldquo entre ellos para maximizar la eficiencia y trabajar diferentes grupos musculares.</p>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>Ejercicio 1: 8-12 repeticiones</li>
              <li>Descanso de 45 segundos</li>
              <li>Ejercicio 2: 8-12 repeticiones</li>
              <li>Descanso de 45 segundos</li>
              <li>Ejercicio 1: 8-12 repeticiones y se vuelve a repetir</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('SST'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>SST</h4>
            <ul className='ml-6 list-disc [&>li]:mt-2 marker:text-card-text text-white text-xs'>
              <li>1ª Serie: 8 reps al máximo peso, 15-20" descanso</li>
              <li>Repite hasta el fallo con el mismo peso</li>
              <li>4ª Serie: Reduce 20% peso, reps al fallo con 5" excéntrica</li>
              <li>5ª Serie: Reduce 20% peso, reps al fallo con 5" concéntrica</li>
              <li>6ª Serie: Reduce 20% peso, 1 rep manteniendo el pico de tensión máxima</li>
            </ul>
          </div>
        )

      case selectedExercise.series.includes('CALENTAMIENTO'):
        return (
          <div className='flex-grow min-h-0 overflow-auto'>
            <h4 className='text-white font-semibold text-sm'>Calentamiento</h4>
            <p className='text-card-text text-xs pt-2 text-pretty'>Una serie con un poco menos del peso máximo que sueles poner en la máquina buscando un rango de repeticiones de 8-12</p>
          </div>
        )

      default:
        return <></>
    }
  }

  return (
    <></>
  )
}
