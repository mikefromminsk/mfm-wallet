# MFM Wallet

MFM Wallet is a cryptocurrency wallet application that allows users to manage their tokens, perform transactions, and interact with various blockchain functionalities. The application is built using PHP and JavaScript, leveraging npm for package management.

## Features
```
Sample text here...
```
```php
function getBalance($address) {
    $sql = "SELECT balance FROM accounts WHERE address = '$address'";
    $result = selectOne($sql);
    return $result['balance'];
}

// Example usage
$address = '0x1234567890abcdef';
$balance = getBalance($address);
echo "Balance: $balance";
```