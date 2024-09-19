export function getFullDay (fecha) {
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const numeroDiaSemana = fecha.getDay()
  const nombreDia = diasSemana[numeroDiaSemana]
  const numeroDia = fecha.getDate()
  const fechaFormateada = fecha.toISOString().split('T')[0]

  return { nombre: nombreDia, numero: numeroDia, full: fechaFormateada }
}

export function getDays () {
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const fechaActual = new Date()
  const numeroDiaSemana = fechaActual.getDay()

  const primerDiaSemana = new Date(fechaActual)
  primerDiaSemana.setDate(fechaActual.getDate() - numeroDiaSemana + 1)

  const diasSemanaObjetos = []

  for (let i = 0; i < 6; i++) {
    const fecha = new Date(primerDiaSemana)
    fecha.setDate(primerDiaSemana.getDate() + i)

    const fechaFormateada = fecha.toISOString().split('T')[0]

    const nombreDia = diasSemana[i]
    const numeroDia = fecha.getDate()

    const diaObjeto = { nombre: nombreDia, numero: numeroDia, full: fechaFormateada }
    diasSemanaObjetos.push(diaObjeto)
  }

  return diasSemanaObjetos
}

export function getPreviousWeek (dateStr) {
  const date = new Date(dateStr)

  date.setDate(date.getDate() - 7)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
