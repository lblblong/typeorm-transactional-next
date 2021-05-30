#### How to use

```typescript
import { Transaction, useTransaction } from 'typeorm-transactional-next'

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
