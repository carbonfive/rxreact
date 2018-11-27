import { withViewModel } from "@rxreact/core"
import * as React from 'react'
import { combineLatest, Observable, of, Subject } from 'rxjs'
import { map, startWith } from 'rxjs/operators'


type CarId = string
interface ICar {
    id: CarId,
    name: string,
    year: number,
    make: string,
    model: string,
}

type Car = ICar

const car1 = { id: '1', name: 'car 1', year: 1992, make: 'a', model: 'a' }
const car2 = { id: '2', name: 'car 2', year: 1234, make: 'a', model: 'a' }
const car3 = { id: '3', name: 'car 3', year: 1233, make: 'a', model: 'a' }

// a list of cars to display
const cars$ : Observable<Car[]> = of([car1, car2, car3])

// a subject representing the action of a user selecting a car
const selectCar$: Subject<CarId> = new Subject();

// the currently selected car, found in the car list each time the user
// selects a car id
const selectedCar$ : Observable<Car | undefined> =
   combineLatest(cars$, selectCar$).pipe(
     map(([cars, selectedCarId]) => cars.find(car => car.id === selectedCarId)),
     startWith(undefined),
   )

const vm = {
  inputs: {
    cars: cars$,
    selectedCar: selectedCar$
  },
  outputs: {
    selectCar: selectCar$
  }
}

interface ICarComponentProps {
    cars: Car[],
    selectedCar: Car | undefined,
    selectCar: (carId: CarId) => void;
    listName: string
}

const CarComponent: React.SFC<ICarComponentProps> = ({ cars, selectedCar, selectCar, listName }) => {
    return (
        <div>
            <h1>{listName}</h1>
            <ul>
                {cars.map(car => (
                    <li key={car.id}
                    // tslint:disable-next-line jsx-no-lambda
                        onClick={() => selectCar(car.id)}
                    >
                        { car.year } { car.make } { car.model }
                    </li>
                ))}
      </ul>
            {selectedCar && (
                <p>
                    You have selected the {selectedCar.year} {selectedCar.make} {selectedCar.model}.
                </p>
            )}
        </div>
    )
}

const CarComponentWithVm = withViewModel(vm)(CarComponent)
export default CarComponentWithVm

