<?php

namespace App\Enums;

enum ChannelStatus: string

{
    case Live = 'live';
    case Record = 'record';
    case Unactive = 'unactive';
}
