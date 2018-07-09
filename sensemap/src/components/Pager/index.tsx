import * as React from 'react';

interface RenderProp<DataType> {
  ({ data, totalPages, currentPage }: {
    data: DataType[],
    totalPages: number,
    currentPage: number,
    handlePageChange(newPage: number): void,
  }): JSX.Element;
}

export interface Props<DataType> {
  data: DataType[];
  pageSize: number;
  currentPage: number;
  children: RenderProp<DataType>;
}

export interface State<DataType> {
  currentPage: number;
}

export class Pager<DataType> extends React.Component<Props<DataType>, State<DataType>> {
  constructor(props: Props<DataType>) {
    super(props);
    this.state = {
      currentPage: props.currentPage || 1,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(newPage: number) {
    this.setState({
      currentPage: newPage,
    });
  }

  render() {
    const { pageSize }    = this.props;
    const { currentPage } = this.state;
    const data = this.props.data.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    const handlePageChange = this.handlePageChange;
    const totalPages = Math.ceil(this.props.data.length / pageSize);
    return this.props.children({
      data,
      totalPages,
      currentPage,
      handlePageChange,
    });
  }
}
