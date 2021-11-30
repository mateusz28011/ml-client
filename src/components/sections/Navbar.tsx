import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { isUserAuthenticated } from '../../features/auth/authSlice';
import { useAppSelector } from '../../app/hooks';
import { useLogoutMutation } from '../../app/services/split/auth';

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const isAuthenticated = useAppSelector(isUserAuthenticated);
  const [logout] = useLogoutMutation();

  return (
    <Box
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        maxW='8xl'
        mx='auto'
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
          >
            Logo
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav isAuthenticated={isAuthenticated} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <Button
            display={isAuthenticated ? 'inline-flex' : 'none'}
            fontSize={'md'}
            fontWeight={'bold'}
            color='red.400'
            variant={'link'}
            onClick={() => logout()}
          >
            Logout
          </Button>
          <Button
            as={RouterLink}
            display={isAuthenticated ? 'none' : 'inline-flex'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            to={'signin'}
          >
            Sign In
          </Button>
          <Button
            as={RouterLink}
            display={
              isAuthenticated ? 'none' : { base: 'none', md: 'inline-flex' }
            }
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'orange.400'}
            to={'signup'}
            _hover={{
              bg: 'orange.300',
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav isAuthenticated={isAuthenticated} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => {
        return (navItem.isPrivate === true && isAuthenticated) ||
          navItem.isPrivate === undefined ? (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  as={RouterLink}
                  p={2}
                  to={navItem.to ?? '#'}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}
                >
                  {navItem.label}
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ) : null;
      })}
    </Stack>
  );
};

const DesktopSubNav = ({ label, to, subLabel }: NavItem) => {
  return (
    <Link
      as={RouterLink}
      to={to ?? '#'}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('orange.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'orange.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'orange.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => {
        return (navItem.isPrivate === true && isAuthenticated) ||
          navItem.isPrivate === undefined ? (
          <MobileNavItem key={navItem.label} {...navItem} />
        ) : null;
      })}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, to }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={to ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link
                as={RouterLink}
                key={child.label}
                py={2}
                to={child.to ?? '#'}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  to?: string;
  isPrivate?: boolean;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'My work',
    children: [
      {
        label: 'Datasets',
        subLabel: 'Manage your datasets',
        to: '/datasets',
      },
      {
        label: 'Empty',
        subLabel: 'Desc',
        to: '/register',
      },
    ],
    isPrivate: true,
  },
  {
    label: 'Empty',
    to: '/login',
  },
];
