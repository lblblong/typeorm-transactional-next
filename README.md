#### How to use

```typescript
import { Transaction, getTransaction } from 'lb-typeorm-transactional'

export class UserService {

  @Transaction()
  async updateInfo() {
    await db.update(...)
    await this.photoService.updatePhoto()
  }
}

export class PhotoService {
  @Transaction()
  async updatePhoto(){
    await db.update(...)
  }
}
```
