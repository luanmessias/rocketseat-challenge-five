import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new Error('You do not have enough balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    if (title === '') {
      throw new Error('Title must be provided');
    }

    if (value === 0) {
      throw new Error(`Value can't be 0`);
    }

    if (type !== 'income' && type !== 'outcome') {
      throw new Error('Transactions accept only income and outcome options');
    }

    return transaction;
  }
}

export default CreateTransactionService;
