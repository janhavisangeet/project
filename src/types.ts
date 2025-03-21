export interface Author {
    _id: string;
    name: string;
}

export interface Pdf {
    _id: string;
      year: Number;
      month: string;
      author: Author;
      file: string;
      createdAt: Date;
      updatedAt: Date;
}

export interface GetPdfsParams {
    month?: string;
    year?: string | number;
    page?: number;
    limit?: number;
}

