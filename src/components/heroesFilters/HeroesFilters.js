import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilters, selectAll } from "./filtersSlice";
import { filterChanged } from "./filtersSlice";
import Spinner from "../spinner/Spinner";
import classNames from "classnames";
import store from "../../store";

const HeroesFilters = () => {
  const { filtersLoadingStatus, activeFilter } = useSelector(
    (state) => state.filters
  );

  const filters = selectAll(store.getState());

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilters());
  }, []);

  if (filtersLoadingStatus === "loading") {
    return <Spinner />;
  } else if (filtersLoadingStatus === "error") {
    return <h5 className='text-center mt-5'>Error of downloading</h5>;
  }

  const renderFilters = (arr) => {
    if (arr.length === 0) {
      return <h5 className='text-center mt-5'>Filters were not found</h5>;
    }

    return arr.map(({ name, className, label }) => {
      const btnClass = classNames("btn", className, {
        active: name === activeFilter,
      });

      return (
        <button
          key={name}
          id={name}
          className={btnClass}
          onClick={() => dispatch(filterChanged(name))}
        >
          {label}
        </button>
      );
    });
  };

  const elements = renderFilters(filters);

  return (
    <div className='card shadow-lg mt-4'>
      <div className='card-body'>
        <p className='card-text'>Отфильтруйте героев по элементам</p>
        <div className='btn-group'>{elements}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
